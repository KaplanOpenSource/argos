import React, { useRef, useState } from "react";
import {
    IconButton,
} from "@mui/material";
import FolderOpenIcon from '@mui/icons-material/FolderOpen';
import HourglassBottomIcon from '@mui/icons-material/HourglassBottom';
import { baseUrl } from "../Context/FetchExperiment";

export const UploadImageIcon = ({ onChangeFile, imageName, experimentName }) => {
    const inputFile = useRef(null);
    const [working, setWorking] = useState(false);

    const onButtonClick = () => {
        // `current` points to the mounted file input element
        inputFile.current.click();
    };

    const getImageSize = async (imageFile) => {
        return new Promise(resolve => {
            const img = new Image();
            img.onload = () => {
                resolve([img.naturalHeight, img.naturalWidth])
            };
            img.src = window.URL.createObjectURL(imageFile);
        })
    }

    const handleChangeFile = async (event) => {
        event.stopPropagation();
        event.preventDefault();

        const file = event.target.files[0];
        if (!file) {
            return;
        }

        setWorking(true);

        const [height, width] = await getImageSize(file);
        if (height && width) {
            const formData = new FormData();
            formData.append('file', file);
            formData.append('imageName', imageName);
            formData.append('experimentName', experimentName);
            const resp = await fetch(baseUrl + "/upload", {
                method: 'POST',
                body: formData,
            });
            const ret = await resp.json();
            const error = (ret || { error: 'invalid server reply' }).error;
            if (error) {
                alert(error);
            } else {
                onChangeFile(ret.path, height, width, ret.filename)
            }
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
                onClick={onButtonClick}
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