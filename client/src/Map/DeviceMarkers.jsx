import { useContext } from "react";
import { Marker } from "react-leaflet";
import { experimentContext } from "../Context/ExperimentProvider";
import { RealMapName } from "../constants/constants";

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

                    </Marker>
                )
            })}
        </>
    )
}