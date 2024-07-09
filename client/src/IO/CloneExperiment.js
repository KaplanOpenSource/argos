import { useCallback, useContext } from "react";
import { experimentContext } from "../Context/ExperimentProvider";
import { useUploadImage } from "./UploadImage";
import { createNewName } from "../Utils/utils";
import { deepClone } from "fast-json-patch";

export const useCloneExperiment = () => {
    const { experiments, addExperiment } = useContext(experimentContext);
    const { uploadImage, downloadImageAsBlob } = useUploadImage();

    const cloneExperiment = useCallback((exp) => {
        const name = createNewName(experiments, exp.name + " cloned");
        addExperiment({ ...deepClone(exp), name });
    }, [experiments]);

    return {
        cloneExperiment,
    }
}