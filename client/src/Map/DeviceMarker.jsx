import { Marker, Popup, Tooltip } from "react-leaflet";
import { SingleDevicePropertiesView } from "./SingleDevicePropertiesView";
import { useContext, useEffect, useRef } from "react";
import { usePopupSwitch } from "./PopupSwitchContext";
import { experimentContext } from "../Context/ExperimentProvider";

export const DeviceMarker = ({ deviceOnTrial, setDeviceOnTrial }) => {
    const { setLocationsToDevices } = useContext(experimentContext);
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

    const setLocation = (latlng) => {
        setLocationsToDevices([{ deviceTypeName, deviceItemName }], [latlng]);
    }

    const locationToString = (coords) => {
        return coords.map(x => Math.round(x * 1e8) / 1e8).join(',')
    }

    return (
        <Marker
            key={deviceTypeName + '_' + deviceItemName}
            position={coordinates}
            ref={ref}
            draggable={true}
            eventHandlers={{
                dragend: e => {
                    // e.target.closeTooltip();
                    setLocation(e.target.getLatLng());
                },
                drag: e => {
                    document.getElementById('tooltip-marker').textContent = locationToString([e.latlng.lat, e.latlng.lng]);
                }
            }}
        >
            <Tooltip>
                {deviceItemName}
                <br />
                <span id="tooltip-marker">
                    {locationToString(coordinates)}
                </span>
            </Tooltip>
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