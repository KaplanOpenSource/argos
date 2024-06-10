import React, { useContext, useRef, useState } from "react";
import HourglassBottomIcon from '@mui/icons-material/HourglassBottom';
import { Upload } from "@mui/icons-material";
import { ButtonTooltip } from "../Utils/ButtonTooltip";
import { experimentContext } from "../Context/ExperimentProvider";
import { UploadExperiment } from "./UploadExperiment";

export const UploadExperimentIcon = ({ }) => {
    const inputFile = useRef(null);
    const { experiments, addExperiment, setExperiment } = useContext(experimentContext);
    const [working, setWorking] = useState(false);

    const handleChangeFile = async (event) => {
        try {
            setWorking(true);
            const file = event.target.files[0];
            new UploadExperiment(addExperiment, setExperiment).go(file, experiments);
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
