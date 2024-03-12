import React, { useRef, useContext } from "react";
// import gql from 'graphql-tag';
// import { WorkingContext } from "../../AppLayout/AppLayout.jsx";
import {
    IconButton,
    Icon,
} from "@mui/material";

import FolderOpenIcon from '@mui/icons-material/FolderOpen';
import { baseUrl } from "../Context/FetchExperiment";

// const UPLOAD_FILE = gql`
//   mutation($file: Upload!) {
//     uploadFile(file: $file){
//       filename
//       path
//     }
//   }`;

export const UploadImageIcon = ({ onChangeFile }) => {
    const inputFile = useRef(null);
    // const { working, setWorking } = useContext(WorkingContext);

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

        // setWorking(true);

        const [height, width] = await getImageSize(file);
        if (height && width) {
            const formData = new FormData();
            formData.append('file', file);
            const resp = await fetch(baseUrl + "/upload", {
                method: 'POST',
                body: formData,
            });
            const ret = await resp.json();
            const error = (ret || { error: 'invalid server reply' }).error;
            if (error) {
                alert(error);
            } else {
                onChangeFile(ret.path, height, width)
            }
        }

        // setWorking(false);
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
            // disabled={working}
            >
                <FolderOpenIcon />
            </IconButton>
        </>
    );
};