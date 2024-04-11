import { Marker, Popup } from "react-leaflet";
import { SingleDevicePropertiesView } from "./SingleDevicePropertiesView";
import { useEffect, useRef } from "react";
import { usePopupSwitch } from "./PopupSwitchContext";

export const DeviceMarker = ({ deviceOnTrial, setDeviceOnTrial }) => {
    const ref = useRef(null);
    const { isPopupSwitchedTo } = usePopupSwitch();
    useEffect(() => {
        if (isPopupSwitchedTo(deviceOnTrial.deviceTypeName + ' : ' + deviceOnTrial.deviceItemName)) {
            ref.current.openPopup();
        }
    })

    const { location, deviceTypeName, deviceItemName } = deviceOnTrial || {};
    const { coordinates } = location || {};
    if (!coordinates) return null;
    return (
        <Marker
            key={deviceTypeName + '_' + deviceItemName}
            position={coordinates}
            ref={ref}
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