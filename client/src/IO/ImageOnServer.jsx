import { Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useUploadImage } from "./UploadImage";

export const ImageOnServer = ({ data, experiment }) => {
    const { downloadImageAsUrl } = useUploadImage();
    const [src, setSrc] = useState();


    useEffect(() => {
        (async () => {
            if (data && data.filename && experiment && experiment.name) {
                setSrc(await downloadImageAsUrl(experiment.name, data.filename));
            }
        })()
    }, [data, experiment]);

    if (!data.filename) {
        return null;
    }

    let { width, height } = data;
    if (Math.max(width, height) > 500 && Math.min(width, height) > 0) {
        if (width > height) {
            height = height / width * 500;
            width = 500;
        } else {
            width = width / height * 500;
            height = 500;
        }
    }
    return (
        <>
            <Typography variant="body2">Size: {data.width} x {data.height}</Typography>
            <img
                src={src}
                width={width}
                height={height}
            />
        </>
    )
}