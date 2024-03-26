import { useContext } from "react";
import { Marker, Popup } from "react-leaflet";
import { experimentContext } from "../Context/ExperimentProvider";
import { RealMapName } from "../constants/constants";
import { SingleDevicePropertiesView } from "./SingleDevicePropertiesView";

export const DeviceMarkers = ({ }) => {
    const { currTrial } = useContext(experimentContext);
    const devicesOnTrial = (currTrial.trial || {}).devicesOnTrial || [];
    const mapName = currTrial.shownMapName || RealMapName;
    const devicesOnTrialMap = devicesOnTrial.filter(d => d.location.name === mapName);
    return (
        <>
            {devicesOnTrialMap.map(d => {
                if (!d.location.coordinates) {
                    console.log('no coordinates on device:', JSON.stringify(d));
                    return null;
                }
                return (
                    <Marker
                        key={d.deviceTypeName + '_' + d.deviceItemName}
                        position={d.location.coordinates}
                    >
                        <Popup>
                            <SingleDevicePropertiesView
                                deviceOnTrial={d}
                                // entityType={entityType}
                                // devLocation={d.location.coordinates}
                            >

                            </SingleDevicePropertiesView>
                        </Popup>
                    </Marker>
                )
            })}
        </>
    )
}