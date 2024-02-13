import { useContext } from "react";
import { Marker } from "react-leaflet";
import { experimentContext } from "../Experiment/ExperimentProvider";

export const DeviceMarkers = ({ }) => {
    const { selection, setSelection, trialData, setTrialData } = useContext(experimentContext);
    const devicesOnTrial = (trialData || {}).devicesOnTrial || [];
    // console.log('devices:\n' + devicesOnTrial.map(d => `${d.deviceItemName}: ${d.location.coordinates.map(x => Math.round(x * 1e7) / 1e7)}`).join('\n'));
    return (
        <>
            {devicesOnTrial.map(d => {
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