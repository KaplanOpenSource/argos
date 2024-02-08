import { useContext } from "react";
import { Marker } from "react-leaflet";
import { experimentContext } from "../Experiment/ExperimentProvider";

export const DeviceMarkers = ({ }) => {
    const { selection, setSelection, currTrial, setTrialData } = useContext(experimentContext);
    return (
        <>
            {((currTrial.trial || {}).devicesOnTrial || []).map(d => {
                console.log(d.location);
                return (
                    <Marker
                        position={d.location.coordinates}
                    >

                    </Marker>
                )
            })}
        </>
    )
}