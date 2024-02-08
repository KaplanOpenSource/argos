import { useContext } from "react";
import { Marker } from "react-leaflet";
import { experimentContext } from "../Experiment/ExperimentProvider";

export const DeviceMarkers = ({ }) => {
    const { selection, setSelection, currTrial, setTrialData } = useContext(experimentContext);
    const devicesOnTrial = (currTrial.trial || {}).devicesOnTrial || [];
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