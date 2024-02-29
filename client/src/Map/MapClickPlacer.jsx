import { useContext } from "react";
import { useMapEvents } from "react-leaflet";
import { experimentContext } from "../Experiment/ExperimentProvider";

export const MapClickPlacer = ({ }) => {
    const { selection, setSelection, currTrial, setTrialData } = useContext(experimentContext);

    const mapObj = useMapEvents({
        click: (e) => {
            if (e.originalEvent.srcElement === mapObj._container) {
                const coordinates = [e.latlng.lat, e.latlng.lng];
                const { experiment, trialType, trial } = currTrial;
                if (experiment && trial && selection.length > 0) {
                    const { deviceTypeName, deviceItemName } = selection[0];
                    setSelection(selection.slice(1));

                    const devicesOnTrial = [...(trial.devicesOnTrial || [])].filter(t => {
                        return t.deviceItemName !== deviceItemName || t.deviceTypeName !== deviceTypeName;
                    });
                    devicesOnTrial.push({ deviceTypeName, deviceItemName, location: { name: 'OSMMap', coordinates } });
                    const data = { ...trial, devicesOnTrial };
                    setTrialData(data);
                }
            }
        },
    });

    return (
        <>
        </>
    )
}