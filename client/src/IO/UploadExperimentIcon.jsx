import React, { useRef, useState } from "react";
import HourglassBottomIcon from '@mui/icons-material/HourglassBottom';
import { Upload } from "@mui/icons-material";
import { ButtonTooltip } from "../Utils/ButtonTooltip";
import { useUploadExperiment } from "./UploadExperiment";

export const UploadExperimentIcon = ({ }) => {
    const inputFile = useRef(null);
    const { uploadExperiment } = useUploadExperiment();
    const [working, setWorking] = useState(false);

    const handleChangeFile = async (event) => {
        try {
            setWorking(true);
            const file = event.target.files[0];
            uploadExperiment(file);
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
