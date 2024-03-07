import { useContext } from "react";
import { experimentContext } from "../Context/ExperimentProvider";
import { MapClickEventer } from "./MapClickEventer";

export const MapClickPlacer = ({ }) => {
    const { selection, setSelection, currTrial, setTrialData } = useContext(experimentContext);

    const onMapClick = (latlng) => {
        const { experiment, trialType, trial } = currTrial;
        if (experiment && trial && selection.length > 0) {
            const { deviceTypeName, deviceItemName } = selection[0];
            setSelection(selection.slice(1));

            const devicesOnTrial = [...(trial.devicesOnTrial || [])].filter(t => {
                return t.deviceItemName !== deviceItemName || t.deviceTypeName !== deviceTypeName;
            });
            devicesOnTrial.push({ deviceTypeName, deviceItemName, location: { name: 'OSMMap', coordinates: latlng } });
            const data = { ...trial, devicesOnTrial };
            setTrialData(data);
        }
    }

    return (
        <MapClickEventer
            onMapClick={onMapClick}
        />
    )
}