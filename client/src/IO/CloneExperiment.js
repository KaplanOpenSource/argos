import { useCallback, useContext } from "react";
import { experimentContext } from "../Context/ExperimentProvider";
import { useUploadImage } from "./UploadImage";
import { createNewName } from "../Utils/utils";

export const useCloneExperiment = () => {
    const { experiments, addExperiment } = useContext(experimentContext);
    const { uploadImage, downloadImageAsBlob } = useUploadImage();

    const cloneExperiment = useCallback(async (experiment) => {
        const name = createNewName(experiments, experiment.name + " cloned");
        const exp = structuredClone(experiment);
        exp.name = name;

        const images = (exp.imageStandalone || []).concat((exp.imageEmbedded || []));
        for (const img of images) {
            if (img.filename) {
                const imageBlob = await downloadImageAsBlob(experiment.name, img.filename);
                console.log(imageBlob, img)
                const ret = await uploadImage(imageBlob, img.name, name, img.filename);
                if (ret) {
                    const { filename, height, width } = ret;
                    img.filename = filename;
                    img.height = height;
                    img.width = width;
                }
            }
        }

        addExperiment(exp);
    }, [experiments]);

    return {
        cloneExperiment,
    }
}