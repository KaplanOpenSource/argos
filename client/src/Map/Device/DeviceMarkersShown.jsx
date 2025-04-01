import { useContext } from "react";
import { useExperimentProvider } from "../../Context/ExperimentProvider";
import { RealMapName } from "../../constants/constants";
import { DeviceMarker } from "./DeviceMarker";
import { PopupSwitchProvider } from "../PopupSwitchContext";
import { AreaMarkListener } from "../AreaMarkListener";
import { useDeviceSeletion } from "../../Context/useDeviceSeletion";

export const DeviceMarkersShown = ({ showDeviceNames }) => {
    const { selection, setSelection } = useDeviceSeletion();
    const { currTrial, setTrialData, hiddenDeviceTypes } = useExperimentProvider();
    const devicesOnTrial = (currTrial.trial || {}).devicesOnTrial || [];
    const mapName = currTrial.shownMapName || RealMapName;

    const devicesWithoutLocation = [];
    const shownDevices = [];

    for (const dev of devicesOnTrial) {
        const { location } = dev;
        if (!location || !location.coordinates) {
            devicesWithoutLocation.push(dev);
        } else if (location.name === mapName) {
            if (!hiddenDeviceTypes[dev.deviceTypeName]) {
                shownDevices.push(dev);
            }
        }
    }

    // if (devicesWithoutLocation.length) {
    //     console.log('no locations on devices:', JSON.stringify(devicesWithoutLocation));
    // }

    return (
        <>
            <PopupSwitchProvider>
                {shownDevices.map((deviceOnTrial, index) => (
                    <DeviceMarker
                        key={index}
                        deviceOnTrial={deviceOnTrial}
                        setDeviceOnTrial={newDeviceData => {
                            const data = { ...currTrial.trial, devicesOnTrial: devicesOnTrial.slice() };
                            data.devicesOnTrial[index] = newDeviceData;
                            setTrialData(data);
                        }}
                        showDeviceNames={showDeviceNames}
                    />
                ))}
            </PopupSwitchProvider>
            <AreaMarkListener
                onAreaMarked={({ boxZoomBounds }) => {
                    const newSelection = [...selection];
                    for (const { deviceItemName, deviceTypeName, location } of shownDevices) {
                        const coordinates = location.coordinates.map(x => parseFloat(x));
                        if (boxZoomBounds.contains(coordinates)) {
                            const isSelected = newSelection.find(s => {
                                return s.deviceItemName === deviceItemName && s.deviceTypeName === deviceTypeName
                            });
                            if (!isSelected) {
                                newSelection.push({ deviceItemName, deviceTypeName });
                            }
                        }
                    }
                    setSelection(newSelection);
                }}
            />
        </>
    )
}