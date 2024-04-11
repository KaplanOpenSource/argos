import { Marker, Popup } from "react-leaflet";
import { SingleDevicePropertiesView } from "./SingleDevicePropertiesView";

export const DeviceMarker = ({ deviceOnTrial, setDeviceOnTrial }) => {
    const { location, deviceTypeName, deviceItemName } = deviceOnTrial || {};
    const { coordinates } = location || {};
    if (!coordinates) return null;
    return (
        <Marker
            key={deviceTypeName + '_' + deviceItemName}
            position={coordinates}
        >
            <Popup>
                <SingleDevicePropertiesView
                    deviceOnTrial={deviceOnTrial}
                    setDeviceOnTrial={setDeviceOnTrial}
                >
                </SingleDevicePropertiesView>
            </Popup>
        </Marker>
    )
}