import JSZip from "jszip";
import { UploadImage } from "./UploadImage";
import { isExperimentVersion2 } from "./ConvertExperiment";
import { argosJsonVersion } from "../constants/constants";

export class UploadExperiment {
    constructor(addExperiment, setExperiment) {
        this.addExperiment = addExperiment;
        this.setExperiment = setExperiment;
    }

    async go(file) {
        if (!file) {
            throw "empty file";
        }
        if (file.name.endsWith('.json')) {
            const text = await new Promise(resolve => {
                const reader = new FileReader();
                reader.onload = (e) => resolve(e.target.result);
                reader.readAsText(file);
            });
            const experiment = JSON.parse(text);
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
        } else if (file.name.endsWith('.zip')) {
            const zip = await JSZip().loadAsync(file);
            const jsonFile = Object.values(zip.files).filter(x => x.name.endsWith('.json'))[0];
            // console.log(zip);
            const text = await jsonFile.async('text');
            const experiment = JSON.parse(text);
            const version = (experiment || {}).version;
            if (version === argosJsonVersion) {
                this.addExperiment(experiment);
                const imageFiles = Object.values(zip.files).filter(x => x.name.startsWith('images/') && !x.dir);
                if (imageFiles.length > 0) {
                    for (const im of imageFiles) {
                        const imageBlob = await im.async('blob');
                        const imageFileName = im.name.split('/').at(-1);
                        const imageName = imageFileName.replace(/\.[^/.]+$/, "");
                        console.log(imageBlob, imageName)
                        await UploadImage(imageBlob, imageName, experiment.name, (filename, height, width) => {
                            const imageData = experiment.imageStandalone.find(x => x.name === imageName) || {};
                            imageData.filename = filename;
                            imageData.height = height;
                            imageData.width = width;
                        }, imageFileName);
                    }
                    this.setExperiment(experiment.name, experiment);
                }
            } else if (isExperimentVersion2(experiment)) {
                console.log('version 2 with zip:', experiment)
            }
        }
    }
}
