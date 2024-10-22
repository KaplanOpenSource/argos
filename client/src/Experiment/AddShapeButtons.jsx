import { useContext, useState } from "react";
import { createNewName } from "../Utils/utils";
import { ButtonTooltip } from "../Utils/ButtonTooltip";
import PolylineIcon from '@mui/icons-material/Polyline';
import { AddCircleOutline } from "@mui/icons-material";
import { assignUuids } from "../Context/TrackUuidUtils";
import { ActionsOnMapContext } from "../Map/ActionsOnMapContext";
import L from 'leaflet';
import { Alert, Snackbar, SnackbarContent } from "@mui/material";

export const AddShapeButtons = ({ data, setData, onBeforeCreate = () => { } }) => {

    const { addActionOnMap } = useContext(ActionsOnMapContext);
    const [snack, setSnack] = useState();

    const shapes = (data?.shapes || []);

    const addShape = (createDrawFromMap, shapeFromEvent, instructions, detailsOnShape) => {
        onBeforeCreate();
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
                const name = createNewName(shapes, "New Shape");
                const newShape = assignUuids({ name, ...shapeFromEvent(e) });
                setData({ ...data, shapes: [...shapes, newShape] });
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

    const addPolyline = () => {
        addShape(
            (mapObj) => new L.Draw.Polyline(mapObj),
            (e) => {
                const coordinates = e?.layer?._latlngs?.map(({ lat, lng }) => [lat, lng]) || [];
                return { "type": "Polyline", coordinates };
            },
            'Click on each point to finish click on the last point',
            (draw) => (draw._markers && draw._markers.length) ? `total ${draw._measurementRunningTotal} of ${draw._markers.length} points` : undefined
        )
    }

    return (<>
        <ButtonTooltip
            tooltip='Add circle'
            onClick={addCircle}
        >
            <AddCircleOutline />
        </ButtonTooltip>
        <ButtonTooltip
            tooltip='Add Polyline'
            onClick={addPolyline}
        >
            <PolylineIcon />
        </ButtonTooltip>
        <Snackbar
            anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            open={snack !== undefined}
        >
            <Alert color="info">
                {snack}
            </Alert>
        </Snackbar>
    </>)
}