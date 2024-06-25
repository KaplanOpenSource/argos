import JSZip from "jszip";
import { UploadImage } from "./UploadImage";
import { ConvertExperiment, isExperimentVersion2 } from "./ConvertExperiment";
import { argosJsonVersion } from "../constants/constants";
import { createNewName } from "../Utils/utils";
import { useCallback, useContext } from "react";
import { experimentContext } from "../Context/ExperimentProvider";

export const useUploadExperiment = () => {
    const { experiments, addExperiment } = useContext(experimentContext);

    const uploadExperiment = useCallback(async (file) => {
        if (!file) {
            throw "empty file";
        }

        const { rawExp, zip } = await readExperiment(file);
        const experiment = checkConvert(rawExp);

        const name = createNewName(experiments, experiment.name); // this is done here to upload images with the correct experiment name
        experiment.name = name;

        if (zip) {
            const imageFiles = Object.values(zip.files).filter(x => x.name.startsWith('images/') && !x.dir);
            if (imageFiles.length > 0) {
                const images = (experiment.imageStandalone || []).concat((experiment.imageEmbedded || []));
                for (const im of imageFiles) {
                    const imageBlob = await im.async('blob');
                    const imageFileName = im.name.split('/').at(-1);
                    const imageName = imageFileName.replace(/\.[^/.]+$/, "");
                    console.log(imageBlob, imageName)
                    const ret = await UploadImage(imageBlob, imageName, experiment.name, imageFileName);
                    if (ret) {
                        const { filename, height, width } = ret;
                        const imageData = images.find(x => x.name === imageName);
                        if (imageData) {
                            imageData.filename = filename;
                            imageData.height = height;
                            imageData.width = width;
                        }
                    }
                }
            }
        }

        addExperiment(experiment);
    }, [experiments, addExperiment]);

    const readExperiment = async (file) => {
        if (file.name.endsWith('.json')) {
            const text = await new Promise(resolve => {
                const reader = new FileReader();
                reader.onload = (e) => resolve(e.target.result);
                reader.readAsText(file);
            });
            const experiment = JSON.parse(text);
            return { rawExp: experiment || {}, zip: undefined };
        }
        if (file.name.endsWith('.zip')) {
            const zip = await JSZip().loadAsync(file);
            const jsonFile = Object.values(zip.files).filter(x => x.name.endsWith('.json'))[0];
            const text = await jsonFile.async('text');
            const experiment = JSON.parse(text);
            return { rawExp: experiment || {}, zip };
        }
        throw "unknown file extension " + file.name;
    }

    const checkConvert = (experiment) => {
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

    return {
        uploadExperiment,
    }
}
