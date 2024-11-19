import { Marker, Popup, Tooltip } from "react-leaflet";
import { SingleDevicePropertiesView } from "./SingleDevicePropertiesView";
import { useContext, useEffect, useRef } from "react";
import { usePopupSwitch } from "../PopupSwitchContext";
import { experimentContext } from "../../Context/ExperimentProvider";
import { renderToStaticMarkup } from "react-dom/server";
import { divIcon } from "leaflet";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMapMarkerAlt } from "@fortawesome/free-solid-svg-icons";
import { IconDeviceByName } from "../../Experiment/IconPicker";

export const DeviceMarker = ({ deviceOnTrial, setDeviceOnTrial, showDeviceNames }) => {
    const { selection, setLocationsToDevices, currTrial } = useContext(experimentContext);
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

    const isSelected = selection.find(s => s.deviceItemName === deviceItemName && s.deviceTypeName === deviceTypeName);

    const deviceType = currTrial.experiment.deviceTypes.find(dt => dt.name === deviceTypeName);
    const iconName = deviceType.icon;

    const icon = divIcon({
        className: 'argos-leaflet-div-icon',
        iconSize: [20, 20],
        iconAnchor: [10, 22],
        html: renderToStaticMarkup(
            <div>
                <IconDeviceByName
                    iconName={iconName}
                    size="xl"
                    color={isSelected ? '#297A31' : '#1B2C6F'}
                />
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
                {showDeviceNames ? null : (
                    <>
                        {deviceItemName}
                        < br />
                    </>
                )}
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