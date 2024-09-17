import { useContext, useEffect } from "react";
import { TreeSublist } from "../App/TreeSublist";
import { ShapeItem } from "./ShapeItem";
import { changeByName, createNewName } from "../Utils/utils";
import { ButtonTooltip } from "../Utils/ButtonTooltip";
import PolylineIcon from '@mui/icons-material/Polyline';
import { AddCircleOutline } from "@mui/icons-material";
import { assignUuids } from "../Context/TrackUuidUtils";
import { ActionsOnMapContext } from "../Map/ActionsOnMapContext";
import L from 'leaflet';

export const ShapeList = ({ data, setData }) => {

    const { addActionOnMap } = useContext(ActionsOnMapContext);

    // Taking care of old shapes without names
    useEffect(() => {
        if (data?.shapes?.length && data.shapes.some(x => !x.name)) {
            const newData = {
                ...data,
                shapes: structuredClone(data.shapes || [])
            };
            for (const shape of data.shapes || []) {
                if (!shape.name) {
                    for (let i = 1; i <= data.shapes.length + 1; ++i) {
                        const cand = "Shape " + i;
                        if (!data.shapes.find(x => x.name === cand)) {
                            shape.name = cand;
                        }
                    }
                }
            }
            setData(newData)
        }
    }, [data]);

    const shapes = (data.shapes || []);

    return (
        <TreeSublist
            parentKey={data.trackUuid}
            data={data}
            fieldName='shapes'
            nameTemplate='New Shape'
            setData={setData}
            noAddButton={true}
            components={<>
                &nbsp;
                <ButtonTooltip
                    tooltip='Add circle'
                    onClick={() => {
                        // const name = createNewName(shapes, "New Circle");
                        // const noNameData = {
                        //     "type": "Circle",
                        //     "center": [
                        //         31.942839972853083,
                        //         34.80056762695313
                        //     ],
                        //     "radius": 3714.772197022863,
                        // };
                        // setData({ ...data, shapes: [...items, assignUuids({ name, ...noNameData })] });
                    }}
                >
                    <AddCircleOutline />
                </ButtonTooltip>
                <ButtonTooltip
                    tooltip='Add Polyline'
                    onClick={() => {
                        addActionOnMap((mapObj) => {
                            const draw = new L.Draw.Polyline(mapObj);
                            draw.enable();
                            mapObj.on(L.Draw.Event.CREATED, (e) => {
                                mapObj.off(L.Draw.Event.CREATED)
                                const coordinates = e.layer._latlngs.map(({ lat, lng }) => [lat, lng]);
                                const newShape = assignUuids({
                                    name: createNewName(shapes, "New Polyline"),
                                    "type": "Polyline",
                                    coordinates
                                });
                                setData({ ...data, shapes: [...shapes, newShape] });
                            });
                        })
                    }}
                >
                    <PolylineIcon />
                </ButtonTooltip>
            </>}
        >
            {
                shapes.map((itemData, i) => {
                    return !itemData?.name ? null : (
                        <ShapeItem
                            key={itemData.name}
                            data={itemData}
                            setData={newData => {
                                setData({ ...data, shapes: changeByName(shapes, itemData.name, newData) });
                            }}
                        />
                    )
                })
            }
        </TreeSublist>
    )
}