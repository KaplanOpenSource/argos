import { Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useUploadImage } from "./UploadImage";

export const ImageOnServer = ({ data, experiment, maxWidth = 500, maxHeight = 500, showSize = true, ...restProps }) => {
    const { downloadImageAsUrl } = useUploadImage();
    const [src, setSrc] = useState();


    useEffect(() => {
        (async () => {
            if (data && data.filename && experiment && experiment.name) {
                const byte64 = await downloadImageAsUrl(experiment.name, data.filename);
                console.log('image read ', data.filename);
                setSrc(byte64);
            }
        })()
    }, [data, experiment]);

    if (!data.filename) {
        return null;
    }

    let { width, height } = data;
    if (Math.min(width, height) > 0) {
        const ratio = Math.min(maxWidth / width, maxHeight / height);
        if (ratio < 1) {
            width *= ratio;
            height *= ratio;
        }
    }

    return (
        <>
            {showSize
                ? <Typography variant="body2">Size: {data.width} x {data.height}</Typography>
                : null}
            <img
                src={src}
                width={width}
                height={height}
                {...restProps}
            />
        </>
    )
}