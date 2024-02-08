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
                        const { deviceTypeName, deviceItemName } = selection[0];
                        const newDevice = { deviceTypeName, deviceItemName, location: { name: 'OSMMap', coordinates } };
                        const devicesOnTrial = [...(trial.devicesOnTrial || [])];
                        const i = devicesOnTrial.findIndex(t => t.deviceItemName === deviceItemName && t.deviceTypeName === deviceTypeName);
                        devicesOnTrial[i >= 0 ? i : devicesOnTrial.length] = newDevice;
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