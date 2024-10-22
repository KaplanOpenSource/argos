import { useContext, useState } from "react";
import { createNewName } from "../Utils/utils";
import { ButtonTooltip } from "../Utils/ButtonTooltip";
import PolylineIcon from '@mui/icons-material/Polyline';
import { AddCircleOutline } from "@mui/icons-material";
import { assignUuids } from "../Context/TrackUuidUtils";
import { ActionsOnMapContext } from "../Map/ActionsOnMapContext";
import L from 'leaflet';
import { Snackbar } from "@mui/material";

export const AddShapeButtons = ({ data, setData }) => {

    const { addActionOnMap } = useContext(ActionsOnMapContext);
    const [snack, setSnack] = useState();

    const shapes = (data?.shapes || []);

    const addShape = (newShapeNoName) => {
        const name = createNewName(shapes, "New Shape");
        const newShape = assignUuids({ name, ...newShapeNoName });
        setData({ ...data, shapes: [...shapes, newShape] });
    }

    const addCircle = () => {
        addActionOnMap((mapObj) => {
            setSnack('Click on the center and drag to the radius');
            const draw = new L.Draw.Circle(mapObj);
            draw.enable();
            mapObj.on(L.Draw.Event.CREATED, (e) => {
                mapObj.off(L.Draw.Event.CREATED);
                setSnack();
                const center = [e.layer._latlng.lat, e.layer._latlng.lng];
                const radius = e.layer._mRadius;
                addShape({ "type": "Circle", center, radius });
            });
        });
    }

    const addPolyline = () => {
        addActionOnMap((mapObj) => {
            setSnack('Click on each point, to finish click on the last point');
            const draw = new L.Draw.Polyline(mapObj);
            draw.enable();

            // Solving a bug in leaflet-draw
            for (const es of document.getElementsByClassName('leaflet-popup-pane')) {
                es.style.zIndex = 599;
            }

            mapObj.on(L.Draw.Event.CREATED, (e) => {
                mapObj.off(L.Draw.Event.CREATED);
                setSnack();
                const coordinates = e?.layer?._latlngs?.map(({ lat, lng }) => [lat, lng]) || [];
                addShape({ "type": "Polyline", coordinates });
            });
        });
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
            anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            open={snack !== undefined}
            message={snack}
        />
    </>)
}