import React, { useContext, useRef, useState } from "react";
import HourglassBottomIcon from '@mui/icons-material/HourglassBottom';
import { Upload } from "@mui/icons-material";
import { ButtonTooltip } from "../Utils/ButtonTooltip";
import { argosJsonVersion } from "../constants/constants";
import { createNewName } from "../Utils/utils";
import { experimentContext } from "../Context/ExperimentProvider";
import JSZip from "jszip";
import { UploadImage } from "./UploadImage";
import { ConvertExperiment } from "./ConvertExperiment";

export const UploadExperimentIcon = ({ }) => {
    const inputFile = useRef(null);
    const { experiments, addExperiment, setExperiment } = useContext(experimentContext);
    const [working, setWorking] = useState(false);

    const addExperimentRename = (experiment) => {
        experiment.name = createNewName(experiments, experiment.name);
        addExperiment(experiment);
    }

    const handleChangeFile = async (event) => {
        try {
            const file = event.target.files[0];
            if (!file) {
                return;
            }

            setWorking(true);

            if (file.name.endsWith('.json')) {
                const text = await new Promise(resolve => {
                    const reader = new FileReader();
                    reader.onload = (e) => resolve(e.target.result);
                    reader.readAsText(file);
                });
                const experiment = JSON.parse(text);
                const version = (experiment || {}).version;
                if (version === argosJsonVersion) {
                    addExperimentRename(experiment);
                } else if (version.startsWith('2.0.0')) {
                    const newExp = ConvertExperiment(experiment);
                    if (newExp) {
                        addExperimentRename(newExp);
                    }
                }
            } else if (file.name.endsWith('.zip')) {
                const zip = await JSZip().loadAsync(file);
                const jsonFile = Object.values(zip.files).filter(x => x.name.endsWith('.json'))[0];
                console.log(zip);
                const text = await jsonFile.async('text');
                const experiment = JSON.parse(text);
                const version = (experiment || {}).version;
                if (version === argosJsonVersion) {
                    addExperimentRename(experiment);
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
                        setExperiment(experiment.name, experiment);
                    }
                } else if (version.startsWith('2.0.0')) {
                    console.log('version 2 with zip:', experiment)
                }
            }
        } catch (error) {
            console.log(error)
            alert(`problem uploading:\n${error}`)
        }
        setWorking(false);
    };

    return (
        <>
            <input
                type="file"
                ref={inputFile}
                style={{ display: "none" }}
                onChange={handleChangeFile}
                accept=".json,.zip"
            />
            <ButtonTooltip
                onClick={() => inputFile.current.click()}
                disabled={working}
                tooltip={"Upload experiment"}
                color="inherit"
            >
                {working
                    ? <HourglassBottomIcon />
                    : <Upload />
                }
            </ButtonTooltip>
        </>
    );
};
