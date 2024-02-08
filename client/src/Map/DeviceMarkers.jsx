import { useContext } from "react";
import { Marker } from "react-leaflet";
import { experimentContext } from "../Experiment/ExperimentProvider";

export const DeviceMarkers = ({ }) => {
    const { selection, setSelection, trialData, setTrialData } = useContext(experimentContext);
    const devicesOnTrial = (trialData || {}).devicesOnTrial || [];
    return (
        <>
            {devicesOnTrial.map(d => {
                console.log(d.location);
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