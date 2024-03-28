import { useContext } from "react";
import { experimentContext } from "../Context/ExperimentProvider";
import { MapClickEventer } from "./MapClickEventer";
import { MarkedShape } from "./MarkedShape";
import { useShape } from "../EditToolBox/ShapeContext";
import { CHOOSE_SHAPE, FREEPOSITIONING_SHAPE, POINT_SHAPE } from "../EditToolBox/utils/constants";

export const MapPlacer = ({
    markedPoints,
    setMarkedPoints,
}) => {
    const { selection, setLocationsToStackDevices } = useContext(experimentContext);
    const {
        shape,
        shapeData,
    } = useShape();

    const onMapClick = (latlng, mapObj) => {
        if (!shapeData.noControlPoints) {
            if (!shapeData.maxPoints) {
                setMarkedPoints([...markedPoints, latlng]);
            } else {
                setMarkedPoints([...markedPoints.slice(0, shapeData.maxPoints - 1), latlng]);
            }
        } else {
            if (shape === FREEPOSITIONING_SHAPE) {
                if (selection.length > 0) {
                    setLocationsToStackDevices([latlng]);
                }
            } else if (shape === POINT_SHAPE) {
                setLocationsToStackDevices(selection.map(_ => latlng));
            } else if (shape === CHOOSE_SHAPE) {
                var tooltip = L.tooltip({ direction: 'top', content: 'Nothing to choose here', }).setLatLng(latlng)
                mapObj.openTooltip(tooltip);
                setTimeout(() => {
                    mapObj.closeTooltip(tooltip);
                }, 500);
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