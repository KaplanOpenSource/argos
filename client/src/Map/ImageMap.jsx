import { ImageOverlay } from "react-leaflet"
import { baseUrl } from "../Context/FetchExperiment"

export const ImageMap = ({ experiment, image }) => {
    let bounds;
    if (image.ytop || image.ybottom) {
        bounds = [[image.ytop, image.xleft], [image.ybottom, image.xright]];
    } else if (image.latnorth || image.latsouth) {
        bounds = [[image.latnorth, image.lngwest], [image.latsouth, image.lngeast]];
    }
    if (!bounds) {
        return null;
    }
    return (
        <ImageOverlay
            url={baseUrl + "/uploads/" + experiment.name + "/" + image.filename}
            bounds={bounds}
        />
    )
}