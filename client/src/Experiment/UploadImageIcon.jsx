import React, { useRef, useState } from "react";
import {
    IconButton,
} from "@mui/material";
import FolderOpenIcon from '@mui/icons-material/FolderOpen';
import HourglassBottomIcon from '@mui/icons-material/HourglassBottom';
import { UploadImage } from "./UploadImage";

export const UploadImageIcon = ({ onChangeFile, imageName, experimentName }) => {
    const inputFile = useRef(null);
    const [working, setWorking] = useState(false);

    const handleChangeFile = async (event) => {
        event.stopPropagation();
        event.preventDefault();
        setWorking(true);

        UploadImage(event.target.files[0], imageName, experimentName, onChangeFile);
        setWorking(false);
    };

    return (
        <>
            <input
                type="file"
                id="file"
                ref={inputFile}
                style={{ display: "none" }}
                onChange={handleChangeFile}
                accept="image/*"
            />
            <IconButton
                onClickCapture={e => {
                    e.stopPropagation();
                    inputFile.current.click(); // `current` is the file input element
                }}
                disabled={working}
            >
                {working
                    ? <HourglassBottomIcon />
                    : <FolderOpenIcon />
                }
            </IconButton>
        </>
    );
};