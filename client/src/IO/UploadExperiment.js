import JSZip from "jszip";
import { UploadImage } from "./UploadImage";
import { isExperimentVersion2 } from "./ConvertExperiment";
import { argosJsonVersion } from "../constants/constants";
import { createNewName } from "../Utils/utils";

export class UploadExperiment {
    constructor(addExperiment, setExperiment) {
        this.addExperiment = addExperiment;
        this.setExperiment = setExperiment;
    }

    async go(file, experiments) {
        if (!file) {
            throw "empty file";
        }

        const rawExp = await this.readExperiment(file);
        const experiment = this.checkConvert(rawExp);

        const name = createNewName(experiments, experiment.name); // this is done here to upload images with the correct experiment name
        experiment.name = name;

        if (this.zip) {
            const imageFiles = Object.values(this.zip.files).filter(x => x.name.startsWith('images/') && !x.dir);
            if (imageFiles.length > 0) {
                for (const im of imageFiles) {
                    const imageBlob = await im.async('blob');
                    const imageFileName = im.name.split('/').at(-1);
                    const imageName = imageFileName.replace(/\.[^/.]+$/, "");
                    console.log(imageBlob, imageName)
                    const ret = await UploadImage(imageBlob, imageName, experiment.name, imageFileName);
                    if (ret) {
                        const { filename, height, width } = ret;
                        let imageData = experiment.imageStandalone.find(x => x.name === imageName);
                        if (!imageData) {
                            imageData = experiment.imageEmbedded.find(x => x.name === imageName);
                        }
                        if (imageData) {
                            imageData.filename = filename;
                            imageData.height = height;
                            imageData.width = width;
                        }
                    }
                }
            }
        }

        this.addExperiment(experiment);
    }

    async readExperiment(file) {
        if (file.name.endsWith('.json')) {
            const text = await new Promise(resolve => {
                const reader = new FileReader();
                reader.onload = (e) => resolve(e.target.result);
                reader.readAsText(file);
            });
            const experiment = JSON.parse(text);
            return experiment || {};
        }
        if (file.name.endsWith('.zip')) {
            this.zip = await JSZip().loadAsync(file);
            const jsonFile = Object.values(this.zip.files).filter(x => x.name.endsWith('.json'))[0];
            // console.log(this.zip);
            const text = await jsonFile.async('text');
            const experiment = JSON.parse(text);
            return experiment || {};
        }
        throw "unknown file extension " + file.name;
    }

    checkConvert(experiment) {
        const version = (experiment || {}).version;
        if (version === argosJsonVersion) {
            return experiment;
        } else if (isExperimentVersion2(experiment)) {
            const newExp = ConvertExperiment(experiment);
            return newExp;
        } else {
            console.log('error', experiment);
            throw "unknown experiment version";
        }
    }
}
