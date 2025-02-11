import { ImageOverlay } from "react-leaflet"
import { useEffect, useState } from "react";
import { useDownloadImage } from "../IO/useDownloadImage";

export const ImageMap = ({ experiment, image }) => {
    const { downloadImageAsUrl } = useDownloadImage();
    const [src, setSrc] = useState();
    useEffect(() => {
        (async () => {
            if (image && image.filename && experiment && experiment.name) {
                const byte64 = await downloadImageAsUrl(experiment.name, image.filename);
                console.log('image read ', image.filename);
                setSrc(byte64);
            }
        })()
    }, [image, experiment]);

    let bounds;
    if (image.ytop || image.ybottom) {
        bounds = [[image.ytop, image.xleft], [image.ybottom, image.xright]];
    } else if (image.latnorth || image.latsouth) {
        bounds = [[image.latnorth, image.lngwest], [image.latsouth, image.lngeast]];
    }
    if (!bounds || !src) {
        return null;
    }
    return (
        <ImageOverlay
            url={src}
            bounds={bounds}
        />
    )
}