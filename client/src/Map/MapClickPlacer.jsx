import { useContext } from "react";
import { useMapEvents } from "react-leaflet";
import { experimentContext } from "../Experiment/ExperimentProvider";

export const MapClickPlacer = ({ }) => {
    const { selection, setSelection, currTrial, setTrialData } = useContext(experimentContext);

    const mapObj = useMapEvents({
        click: (e) => {
            (async () => {
                if (e.originalEvent.srcElement === mapObj._container) {
                    const coordinates = [e.latlng.lat, e.latlng.lng];
                    const { experiment, trialType, trial } = currTrial;
                    console.log(coordinates, experiment, trial);
                    if (experiment && trial && selection.length > 0) {
                        const newDevice = { ...(selection[0]), location: { name: 'OSMMap', coordinates } };
                        const devicesOnTrial = [...(trial.devicesOnTrial || []), newDevice];
                        const data = { ...trial, devicesOnTrial };
                        setSelection(selection.slice(1));
                        await setTrialData(data);
                    }
                }
            })();
        },
    });

    return (
        <>
        </>
    )
}