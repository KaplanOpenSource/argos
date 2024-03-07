import { useContext } from "react";
import { Marker } from "react-leaflet";
import { experimentContext } from "../Context/ExperimentProvider";

export const DeviceMarkers = ({ }) => {
    const { currTrial } = useContext(experimentContext);
    const devicesOnTrial = (currTrial.trial || {}).devicesOnTrial || [];
    // console.log('devices:\n' + devicesOnTrial.map(d => `${d.deviceItemName}: ${d.location.coordinates.map(x => Math.round(x * 1e7) / 1e7)}`).join('\n'));
    return (
        <>
            {devicesOnTrial.map(d => {
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