import React, { useContext, useRef, useState } from "react";
import HourglassBottomIcon from '@mui/icons-material/HourglassBottom';
import { Upload } from "@mui/icons-material";
import { ButtonTooltip } from "../Utils/ButtonTooltip";
import { argosJsonVersion } from "../constants/constants";
import { createNewName } from "../Utils/utils";
import { experimentContext } from "../Context/ExperimentProvider";

export const UploadExperimentIcon = ({ }) => {
    const inputFile = useRef(null);
    const { experiments, addExperiment } = useContext(experimentContext);
    const [working, setWorking] = useState(false);

    const handleChangeFile = async (event) => {
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
                accept="*"
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
