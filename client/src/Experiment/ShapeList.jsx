import { useEffect } from "react";
import { TreeSublist } from "../App/TreeSublist";
import { ShapeItem } from "./ShapeItem";
import { changeByName } from "../Utils/utils";

export const ShapeList = ({ data, setData }) => {
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

    return (
        <TreeSublist
            parentKey={data.trackUuid}
            data={data}
            fieldName='shapes'
            nameTemplate='New Shape'
            setData={setData}
        >
            {
                (data.shapes || []).map((itemData, i) => {
                    return !itemData?.name ? null : (
                        <ShapeItem
                            key={itemData.name}
                            data={itemData}
                            setData={newData => {
                                setData({ ...data, shapes: changeByName(data.shapes, itemData.name, newData) });
                            }}
                        />
                    )
                })
            }
        </TreeSublist>
    )
}