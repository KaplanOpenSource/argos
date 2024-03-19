import { ImageOverlay } from "react-leaflet"
import { baseUrl } from "../Context/FetchExperiment"

export const ImageMap = ({ experiment, image }) => {
    return (
        <ImageOverlay
            url={baseUrl + "/uploads/" + experiment.name + "/" + image.filename}
            bounds={[[image.ytop, image.xleft], [image.ybottom, image.xright]]}
        />
    )
}