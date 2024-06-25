import React, { useRef, useState } from "react";
import {
    IconButton,
} from "@mui/material";
import FolderOpenIcon from '@mui/icons-material/FolderOpen';
import HourglassBottomIcon from '@mui/icons-material/HourglassBottom';
import { useUploadImage } from "./UploadImage";

export const UploadImageIcon = ({ onChangeFile, imageName, experimentName }) => {
    const inputFile = useRef(null);
    const [working, setWorking] = useState(false);
    const { uploadImage } = useUploadImage();

    const handleChangeFile = async (event) => {
        event.stopPropagation();
        event.preventDefault();
        setWorking(true);
        const ret = await uploadImage(event.target.files[0], imageName, experimentName);
        if (ret) {
            const { filename, height, width } = ret;
            onChangeFile(filename, height, width);
        }
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
                    e.preventDefault();
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