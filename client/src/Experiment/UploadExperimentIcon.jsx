import React, { useContext, useRef, useState } from "react";
import HourglassBottomIcon from '@mui/icons-material/HourglassBottom';
import { Upload } from "@mui/icons-material";
import { ButtonTooltip } from "../Utils/ButtonTooltip";
import { argosJsonVersion } from "../constants/constants";
import { createNewName } from "../Utils/utils";
import { experimentContext } from "../Context/ExperimentProvider";
import JSZip from "jszip";

export const UploadExperimentIcon = ({ }) => {
    const inputFile = useRef(null);
    const { experiments, addExperiment } = useContext(experimentContext);
    const [working, setWorking] = useState(false);

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
                if ((experiment || {}).version === argosJsonVersion) {
                    experiment.name = createNewName(experiments, experiment.name);
                    addExperiment(experiment);
                }
            } else if (file.name.endsWith('.zip')) {
                const zip = JSZip();
                await zip.loadAsync(file);
                const jsonFile = Object.values(zip.files).filter(x => x.name.endsWith('.json'))[0];
                console.log(zip);
                console.log(Object.keys(zip.files));
                console.log(jsonFile);
                const text = await jsonFile.async('text');
                const experiment = JSON.parse(text);
                if ((experiment || {}).version === argosJsonVersion) {
                    experiment.name = createNewName(experiments, experiment.name);
                    addExperiment(experiment);
                }
                // zip.files()
                // const text = await new Promise(resolve => {
                //     const reader = new FileReader();
                //     reader.onload = (e) => resolve(e.target.result);
                //     reader.readAsBinaryString(file);
                // });
                // const experiment = JSON.parse(text);
                // if ((experiment || {}).version === argosJsonVersion) {
                //     experiment.name = createNewName(experiments, experiment.name);
                //     addExperiment(experiment);
                // }
            }
        } catch (error) {
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
            >
                {working
                    ? <HourglassBottomIcon />
                    : <Upload />
                }
            </ButtonTooltip>
        </>
    );
};
