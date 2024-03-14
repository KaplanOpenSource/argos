import { Typography } from "@mui/material";
import { baseUrl } from "../Context/FetchExperiment";

export const ImageOnServer = ({ data }) => {
    if (!data.url) {
        return null;
    }
    const src = baseUrl + data.url + "?";
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