import { Marker, Tooltip } from "react-leaflet"
import { CustomIcon } from "./CustomIcon"

export const PlacementDraggableMarker = ({ imageData, setImageData, location, setLocation }) => {
    return (
        <Marker
            draggable={true}
            position={location}
            eventHandlers={{
                dragend: e => setLocation(e.target.getLatLng()),
            }}
            icon={CustomIcon()}
        >
            <Tooltip permanent direction="top" interactive offset={[0, -7]}>
                move me
            </Tooltip>
        </Marker>
    )
}