import { useContext } from "react";
import { Marker, Popup } from "react-leaflet";
import { experimentContext } from "../Context/ExperimentProvider";
import { RealMapName } from "../constants/constants";
import { SingleDevicePropertiesView } from "./SingleDevicePropertiesView";

export const DeviceMarkers = ({ }) => {
    const { currTrial, setTrialData } = useContext(experimentContext);
    const devicesOnTrial = (currTrial.trial || {}).devicesOnTrial || [];
    const mapName = currTrial.shownMapName || RealMapName;
    return (
        <>
            {devicesOnTrial.map((deviceOnTrial, index) => {
                const { location, deviceTypeName, deviceItemName } = deviceOnTrial || {};
                if (location && location.name === mapName) {
                    const { coordinates } = location;
                    if (!coordinates) {
                        console.log('no coordinates on device:', JSON.stringify(deviceOnTrial));
                        return null;
                    }
                    return (
                        <Marker
                            key={deviceTypeName + '_' + deviceItemName}
                            position={coordinates}
                        >
                            <Popup>
                                <SingleDevicePropertiesView
                                    deviceOnTrial={deviceOnTrial}
                                    setDeviceOnTrial={newDeviceData => {
                                        const data = { ...currTrial.trial, devicesOnTrial: devicesOnTrial.slice() };
                                        data.devicesOnTrial[index] = newDeviceData;
                                        setTrialData(data);
                                    }}
                                >
                                </SingleDevicePropertiesView>
                            </Popup>
                        </Marker>
                    )
                }
            })}
        </>
    )
}