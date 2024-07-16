import React, { useRef, useState } from "react";
import { ButtonTooltip } from "../Utils/ButtonTooltip";
import { HourglassBottom } from "@mui/icons-material";

export const UploadButton = ({ accept, tooltip, uploadFunc, children }) => {
    const inputFile = useRef(null);
    const [working, setWorking] = useState(false);

    const handleChangeFile = async (event) => {
        try {
            setWorking(true);
            const file = event.target.files[0];
            if (!file) {
                throw "empty file";
            }
            uploadFunc(file);
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
                accept={accept}
            />
            <ButtonTooltip
                onClick={() => inputFile.current.click()}
                disabled={working}
                tooltip={tooltip}
                color="inherit"
            >
                {working
                    ? <HourglassBottom />
                    : <>
                        {children}
                    </>
                }
            </ButtonTooltip>
        </>
    );
};
