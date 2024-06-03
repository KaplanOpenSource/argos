import { useContext } from "react";
import { experimentContext } from "../Context/ExperimentProvider";
import { MapEventer } from "./MapEventer";
import { MarkedShape } from "./MarkedShape";
import { useShape } from "../EditToolBox/ShapeContext";
import { CHOOSE_SHAPE, FREEPOSITIONING_SHAPE, POINT_SHAPE } from "../EditToolBox/utils/constants";
import { MapContextMenu } from "./MapContextMenu";

export const MapPlacer = ({
    markedPoints,
    setMarkedPoints,
}) => {
    const { selection, setLocationsToStackDevices } = useContext(experimentContext);
    const {
        shape,
        shapeData,
    } = useShape();

    const onMapClick = (e, mapObj) => {
        const latlng = [e.latlng.lat, e.latlng.lng];
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
            <MapEventer
                mapEvents={{ click: onMapClick }}
                directlyOnMap={true}
            />
            <MarkedShape
                markedPoints={markedPoints}
                setMarkedPoints={setMarkedPoints}
                entityNum={selection.length}
            // distanceInMeters={showDistanceInMeters}
            />
            <MapContextMenu
                menuItems={[
                    {
                        label: 'Place top point here',
                        callback: (e, latlng) => {
                            if (selection.length > 0) {
                                setLocationsToStackDevices([latlng]);
                            }
                        }
                    }
                ]}
            />
        </>
    )
}