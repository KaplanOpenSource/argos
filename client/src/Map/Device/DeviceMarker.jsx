import { Marker, Popup, Tooltip } from "react-leaflet";
import { SingleDevicePropertiesView } from "./SingleDevicePropertiesView";
import { useContext, useEffect, useRef } from "react";
import { usePopupSwitch } from "../PopupSwitchContext";
import { experimentContext } from "../../Context/ExperimentProvider";
import { renderToStaticMarkup } from "react-dom/server";
import { divIcon } from "leaflet";
import { IconDeviceByName } from "../../Experiment/IconPicker";
import { locationToString } from "../../Utils/utils";
import { useShape } from "../../EditToolBox/ShapeContext";
import { SELECT_SHAPE } from "../../EditToolBox/utils/constants";
import { useCurrTrial } from "../../Context/useCurrTrial";

export const DeviceMarker = ({ deviceOnTrial, setDeviceOnTrial, showDeviceNames }) => {
    const {
        selection,
        setSelection,
        currTrial,
    } = useContext(experimentContext);
    const { trial } = useCurrTrial({});

    const ref = useRef(null);
    const { isPopupSwitchedTo } = usePopupSwitch();
    const { shape } = useShape();

    useEffect(() => {
        if (isPopupSwitchedTo(deviceOnTrial.deviceTypeName + ' : ' + deviceOnTrial.deviceItemName)) {
            ref.current.openPopup();
        }
    })

    const { location, deviceTypeName, deviceItemName } = deviceOnTrial || {};
    const { coordinates } = location || {};
    if (!coordinates) return null;

    const setLocation = (latlng) => {
        trial.getDevice(deviceTypeName, deviceItemName).setLocationOnMap([latlng.lat, latlng.lng], currTrial.shownMapName);
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
                },
                click: () => {
                    if (shape === SELECT_SHAPE) {
                        const selectedIndex = selection.findIndex(t => {
                            return t.deviceTypeName === deviceTypeName && t.deviceItemName === deviceItemName;
                        });
                        if (selectedIndex !== -1) {
                            setSelection(selection.filter((_, i) => i !== selectedIndex));
                        } else {
                            setSelection([...selection, { deviceTypeName, deviceItemName }]);
                        }
                    }
                },
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
            <Popup
                offset={[-3, -15]}
            >
                <SingleDevicePropertiesView
                    deviceOnTrial={deviceOnTrial}
                    setDeviceOnTrial={setDeviceOnTrial}
                >
                </SingleDevicePropertiesView>
            </Popup>
        </Marker>
    )
}