import { useContext } from "react";
import { experimentContext } from "../Context/ExperimentProvider";
import { RealMapName } from "../constants/constants";
import { DeviceMarker } from "./DeviceMarker";
import { PopupSwitchProvider } from "./PopupSwitchContext";
import { AreaMarkListener } from "./AreaMarkListener";

export const DeviceMarkersShown = ({ showDeviceNames }) => {
    const { currTrial, setTrialData, selection, setSelection } = useContext(experimentContext);
    const devicesOnTrial = (currTrial.trial || {}).devicesOnTrial || [];
    const mapName = currTrial.shownMapName || RealMapName;
    const devicesWithoutLocation = devicesOnTrial.filter(({ location }) => !location || !location.coordinates);
    if (devicesWithoutLocation.length) {
        console.log('no locations on devices:', JSON.stringify(devicesWithoutLocation));
    }
    const shownDevices = devicesOnTrial.filter(({ location }) => location && location.coordinates && location.name === mapName);
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
                    const added = [];
                    for (const { deviceItemName, deviceTypeName, location } of shownDevices) {
                        if (boxZoomBounds.contains(location.coordinates)) {
                            const isSelected = selection.find(s => {
                                return s.deviceItemName === deviceItemName && s.deviceTypeName === deviceTypeName
                            });
                            if (!isSelected) {
                                added.push({deviceItemName, deviceTypeName});
                            }
                        }
                    }
                    setSelection([...selection, ...added]);
                }}
            />
        </>
    )
}