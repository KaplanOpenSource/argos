import { useContext } from "react";
import { experimentContext } from "../Context/ExperimentProvider";
import { MapEventer } from "./MapEventer";
import { MarkedShape } from "./MarkedShape";
import { useShape } from "../EditToolBox/ShapeContext";
import { CHOOSE_SHAPE, FREEPOSITIONING_SHAPE, POINT_SHAPE } from "../EditToolBox/utils/constants";
import { MapContextMenu } from "./MapContextMenu";
import { useCurrTrial } from "../Context/useCurrTrial";
import { useDeviceSeletion } from "../Context/useDeviceSeletion";

export const MapPlacer = ({
    markedPoints,
    setMarkedPoints,
}) => {
    const { selection, setSelection } = useDeviceSeletion();
    const { currTrial } = useContext(experimentContext);
    const { shape, shapeData } = useShape();
    const { trial } = useCurrTrial({});

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
                    const dev = trial.getDevice(selection[0].deviceTypeName, selection[0].deviceItemName);
                    dev.setLocationOnMap(latlng, currTrial.shownMapName);
                    setSelection(selection.slice(1));
                }
            } else if (shape === POINT_SHAPE) {
                if (selection.length > 0) {
                    const draft = trial.createDraft();
                    for (const s of selection) {
                        const dev = draft.getDevice(s.deviceTypeName, s.deviceItemName);
                        dev.setLocationOnMap(latlng, currTrial.shownMapName);
                    }
                    trial.setTrialData(draft.getTrialData());
                    setSelection([]);
                }
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
                                const dev = trial.getDevice(selection[0].deviceTypeName, selection[0].deviceItemName);
                                dev.setLocationOnMap(latlng, currTrial.shownMapName);
                                setSelection(selection.slice(1));
                            }
                        }
                    }
                ]}
            />
        </>
    )
}