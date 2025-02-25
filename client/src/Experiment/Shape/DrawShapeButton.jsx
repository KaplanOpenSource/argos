import { useContext, useState } from "react";
import { createNewName } from "../../Utils/utils";
import { ButtonTooltip } from "../../Utils/ButtonTooltip";
import PolylineIcon from '@mui/icons-material/Polyline';
import { AddCircleOutline, Edit } from "@mui/icons-material";
import { assignUuids } from "../../Context/TrackUuidUtils";
import { ActionsOnMapContext } from "../../Map/ActionsOnMapContext";
import L from 'leaflet';
import { Alert, Snackbar, SnackbarContent } from "@mui/material";
import { ExperimentTreeNodesExpandedContext } from "../ExperimentTreeNodesExpandedProvider";

export const DrawShapeButton = ({ data, setData }) => {

    const { addActionOnMap } = useContext(ActionsOnMapContext);
    // const { addExpandedNode } = useContext(ExperimentTreeNodesExpandedContext);

    const [snack, setSnack] = useState();

    // const onBeforeCreate = () => addExpandedNode(data.trackUuid + '_shapes');

    // const shapes = (data?.shapes || []);

    const addShape = (createDrawFromMap, shapeFromEvent, instructions, detailsOnShape) => {
        // onBeforeCreate();
        setSnack(instructions);
        addActionOnMap((mapObj) => {
            const draw = createDrawFromMap(mapObj);
            draw.enable();

            // Solving a bug in leaflet-draw
            for (const es of document.getElementsByClassName('leaflet-popup-pane')) {
                es.style.zIndex = 599;
            }

            mapObj.on('mousemove', e => {
                const details = draw?._tooltip?._container?.innerText;
                if (details) {
                    setSnack(details);
                }
            })
            mapObj.on('draw:canceled', (e) => {
                mapObj.off(L.Draw.Event.CREATED);
                mapObj.off('draw:canceled');
                mapObj.off('mousemove');
                setSnack();
            });
            mapObj.on(L.Draw.Event.CREATED, (e) => {
                mapObj.off(L.Draw.Event.CREATED);
                mapObj.off('draw:canceled');
                mapObj.off('mousemove');
                setSnack();
                const newShape = assignUuids({ ...data, ...shapeFromEvent(e) });
                setData(newShape);
            });
        });
    }

    const addCircle = () => {
        addShape(
            (mapObj) => new L.Draw.Circle(mapObj),
            (e) => {
                const center = [e.layer._latlng.lat, e.layer._latlng.lng];
                const radius = e.layer._mRadius;
                return { "type": "Circle", center, radius };
            },
            'Click on the center and drag to the radius',
            (draw) => draw._shape && `radius ${draw._shape._mRadius}`,
        );
    }

    const addPolyline = (isPolygon) => {
        addShape(
            (mapObj) => {
                if (isPolygon) {
                    return new L.Draw.Polygon(mapObj);
                } else {
                    return new L.Draw.Polyline(mapObj);
                }
            },
            (e) => {
                const latlngs = (isPolygon ? e?.layer?._latlngs[0] : e?.layer?._latlngs) || [];
                const coordinates = latlngs.map(({ lat, lng }) => [lat, lng]) || [];
                const type = isPolygon ? "Polygon" : "Polyline";
                return { type, coordinates };
            },
            'Click on each point to finish click on the last point',
            (draw) => (draw._markers && draw._markers.length) ? `total ${draw._measurementRunningTotal} of ${draw._markers.length} points` : undefined
        )
    }

    return (<>
        <ButtonTooltip
            tooltip='Draw Shape'
            onClick={() => {
                if (data.type === 'Circle') {
                    addCircle();
                } else if (data.type === 'Polyline') {
                    addPolyline(false);
                } else {
                    addPolyline(true);
                }
            }}
        >
            <Edit />
        </ButtonTooltip>
        <Snackbar
            anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            open={snack !== undefined}
            style={{ zIndex: 10000 }}
        >
            <Alert color="info">
                {snack}
            </Alert>
        </Snackbar>
    </>)
}