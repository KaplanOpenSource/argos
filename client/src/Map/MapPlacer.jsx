import { useContext } from "react";
import { experimentContext } from "../Context/ExperimentProvider";
import { MapClickEventer } from "./MapClickEventer";
import { MarkedShape } from "./MarkedShape";
import { useShape } from "../EditToolBox/ShapeContext";
import { FREEPOSITIONING_SHAPE } from "../EditToolBox/utils/constants";

export const MapPlacer = ({
    markedPoints,
    setMarkedPoints,
}) => {
    const { selection, setSelection, currTrial, setTrialData } = useContext(experimentContext);
    const {
        shape,
        shapeData,
    } = useShape();

    const setDeviceLocation = (trial, deviceTypeName, deviceItemName, latlng) => {
        const devicesOnTrial = [...(trial.devicesOnTrial || [])].filter(t => {
            return t.deviceItemName !== deviceItemName || t.deviceTypeName !== deviceTypeName;
        });
        devicesOnTrial.push({ deviceTypeName, deviceItemName, location: { name: 'OSMMap', coordinates: latlng } });
        const data = { ...trial, devicesOnTrial };
        setTrialData(data);
    }

    const onMapClick = (latlng) => {
        if (shape === FREEPOSITIONING_SHAPE) {
            const { experiment, trialType, trial } = currTrial;
            if (experiment && trial && selection.length > 0) {
                const { deviceTypeName, deviceItemName } = selection[0];
                setSelection(selection.slice(1));
                setDeviceLocation(trial, deviceTypeName, deviceItemName, latlng);
            }
        } else {
            if (!shapeData.noControlPoints) {
                if (!shapeData.maxPoints) {
                    setMarkedPoints([...markedPoints, latlng]);
                } else {
                    setMarkedPoints([...markedPoints.slice(0, shapeData.maxPoints - 1), latlng]);
                }
            }
        }
    }

    return (
        <>
            <MapClickEventer
                onMapClick={onMapClick}
            />
            <MarkedShape
                markedPoints={markedPoints}
                setMarkedPoints={setMarkedPoints}
                entityNum={selection.length}
            // distanceInMeters={showDistanceInMeters}
            />
        </>
    )
}