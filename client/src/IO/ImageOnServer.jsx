import { Typography } from "@mui/material";
import { TokenContext } from "../App/TokenContext";
import { useContext, useEffect, useState } from "react";

export const ImageOnServer = ({ data, experiment }) => {
    const { axiosToken } = useContext(TokenContext);
    const [src, setSrc] = useState();

    if (!data.filename) {
        return null;
    }

    useEffect(() => {
        (async () => {
            const url = "uploads/" + experiment.name + "/" + data.filename;
            const resp = await axiosToken().get(url, { responseType: "arraybuffer" });
            const bytes = new Uint8Array(resp.data);
            const str = bytes.map(b => String.fromCharCode(b)).join('');
            const b64 = `data:image/png;base64, ` + btoa(str);
            setSrc(b64);
        })()
    }, [data, experiment]);

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