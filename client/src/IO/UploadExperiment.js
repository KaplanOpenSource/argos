import JSZip from "jszip";
import { UploadImage } from "./UploadImage";
import { isExperimentVersion2 } from "./ConvertExperiment";
import { argosJsonVersion } from "../constants/constants";
import { deepClone } from "fast-json-patch";

export class UploadExperiment {
    constructor(addExperiment, setExperiment) {
        this.addExperiment = addExperiment;
        this.setExperiment = setExperiment;
    }

    async go(file) {
        if (!file) {
            throw "empty file";
        }

        const experiment = await this.readExperiment(file);

        this.addConvertedExperiment(experiment);

        if (this.zip) {
            const imageFiles = Object.values(this.zip.files).filter(x => x.name.startsWith('images/') && !x.dir);
            if (imageFiles.length > 0) {
                const exp = deepClone(experiment);
                for (const im of imageFiles) {
                    const imageBlob = await im.async('blob');
                    const imageFileName = im.name.split('/').at(-1);
                    const imageName = imageFileName.replace(/\.[^/.]+$/, "");
                    console.log(imageBlob, imageName)
                    const ret = await UploadImage(imageBlob, imageName, exp.name, imageFileName);
                    if (ret) {
                        const { filename, height, width } = ret;
                        const imageData = { ...exp.imageStandalone.find(x => x.name === imageName) }
                        if (imageData) {
                            imageData.filename = filename;
                            imageData.height = height;
                            imageData.width = width;
                        }
                    }
                }
                this.setExperiment(experiment.name, exp);
            }
        }
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

    addConvertedExperiment(experiment) {
        const version = (experiment || {}).version;
        if (version === argosJsonVersion) {
            this.addExperiment(experiment);
        } else if (isExperimentVersion2(experiment)) {
            const newExp = ConvertExperiment(experiment);
            if (newExp) {
                this.addExperiment(newExp);
            }
        } else {
            console.log('error', experiment);
            throw "unknown experiment version";
        }
    }
}
