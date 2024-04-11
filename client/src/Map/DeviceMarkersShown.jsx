import { useContext } from "react";
import { experimentContext } from "../Context/ExperimentProvider";
import { RealMapName } from "../constants/constants";
import { DeviceMarker } from "./DeviceMarker";

export const DeviceMarkersShown = ({ }) => {
    const { currTrial, setTrialData } = useContext(experimentContext);
    const devicesOnTrial = (currTrial.trial || {}).devicesOnTrial || [];
    const mapName = currTrial.shownMapName || RealMapName;
    const devicesWithoutLocation = devicesOnTrial.filter(({ location }) => !location || !location.coordinates);
    if (devicesWithoutLocation.length) {
        console.log('no locations on devices:', JSON.stringify(devicesWithoutLocation));
    }
    const shownDevices = devicesOnTrial.filter(({ location }) => location && location.coordinates && location.name === mapName);
    return (
        <>
            {shownDevices.map((deviceOnTrial, index) => (
                <DeviceMarker
                    key={index}
                    deviceOnTrial={deviceOnTrial}
                    setDeviceOnTrial={newDeviceData => {
                        const data = { ...currTrial.trial, devicesOnTrial: devicesOnTrial.slice() };
                        data.devicesOnTrial[index] = newDeviceData;
                        setTrialData(data);
                    }}
                />
            ))}
        </>
    )
}