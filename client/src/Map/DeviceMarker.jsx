import { Marker, Popup, Tooltip } from "react-leaflet";
import { SingleDevicePropertiesView } from "./SingleDevicePropertiesView";
import { useContext, useEffect, useRef } from "react";
import { usePopupSwitch } from "./PopupSwitchContext";
import { experimentContext } from "../Context/ExperimentProvider";
import { renderToStaticMarkup } from "react-dom/server";
import { divIcon } from "leaflet";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMapMarkerAlt } from "@fortawesome/free-solid-svg-icons";

export const DeviceMarker = ({ deviceOnTrial, setDeviceOnTrial, showDeviceNames }) => {
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

    const icon = divIcon({
        className: 'argos-leaflet-div-icon',
        iconSize: [20, 20],
        iconAnchor: [10, 22],
        html: renderToStaticMarkup(
            <div>
                <FontAwesomeIcon
                    icon={faMapMarkerAlt}
                    size="xl"
                    color="#297A31"
                />
                {/* style={{ color: '#297A31' }} */}
                {/* <i className=" fa fa-map-marker-alt fa-2x"
            // style={{ color: (isTypeSelected ? (isSelected ? '#297A31' : '#1B2C6F') : '#888888') }}
            /> */}
                {!showDeviceNames ? null :
                    <span style={{ backgroundColor: "#fafa44", marginTop: 5, padding: 3, borderColor: "black", color: '#ff4466' }}>
                        {deviceItemName.replace(/ /g, '\u00a0')}
                    </span>
                }
            </div>
        )
    });

    return (
        <Marker
            key={deviceTypeName + '_' + deviceItemName}
            position={coordinates}
            ref={ref}
            draggable={true}
            icon={icon}
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