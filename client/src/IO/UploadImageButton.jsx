import React, { useState } from "react";
import FolderOpenIcon from '@mui/icons-material/FolderOpen';
import HourglassBottomIcon from '@mui/icons-material/HourglassBottom';
import { useUploadImage } from "./useUploadImage";
import { ButtonFile } from "../Utils/ButtonFile";

export const UploadImageButton = ({ onChangeFile, imageName, experimentName }) => {
    const [working, setWorking] = useState(false);
    const { uploadImage } = useUploadImage();

    const handleChangeFile = async (files) => {
        setWorking(true);
        const ret = await uploadImage(files[0], imageName, experimentName);
        if (ret) {
            const { filename, height, width } = ret;
            onChangeFile(filename, height, width);
        }
        setWorking(false);
    };

    return (
        <>
            <ButtonFile
                accept="image/*"
                color='default'
                tooltip={'Upload image'}
                onChange={handleChangeFile}
                disabled={working}
            >
                {working
                    ? <HourglassBottomIcon />
                    : <FolderOpenIcon />
                }
            </ButtonFile>
        </>
    );
};