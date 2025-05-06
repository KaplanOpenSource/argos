import { faCrosshairs } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { divIcon } from "leaflet"
import { renderToStaticMarkup } from "react-dom/server"

export const CustomIcon = () => {
    return divIcon({
        className: 'argos-leaflet-div-icon',
        iconSize: [20, 20],
        html: renderToStaticMarkup(
            <div >
                <FontAwesomeIcon icon={faCrosshairs} />
            </div>
        ),
        iconAnchor: [6, 9]
    })
}