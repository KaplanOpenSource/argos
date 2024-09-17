import { Fragment, useEffect, useRef, useState } from "react";
import { Case, SwitchCase } from "../Utils/SwitchCase";
import { CircleEdit } from "./CircleEdit";
import { PolygonEdit, PolyLineEdit } from "./PolyEdit";

export const MapDrawShape = ({ data, setData }) => {
    const [inter, setInter] = useState({ data: data, number: 0 });
    const isInternalChange = useRef(false);

    useEffect(() => {
        if (!isInternalChange.current) {
            setInter(prev => ({ ...prev, data: data, number: prev.number + 1 }));
        }
        isInternalChange.current = false; // Reset after effect
    }, [data]);

    const handleChange = (newValue) => {
        setInter(prev => ({ ...prev, data: newValue }));
        isInternalChange.current = true; // Mark as internal change
        setData(newValue); // Update data in the parent without incrementing number
    };

    return (
        <Fragment key={inter.number}>
            <SwitchCase test={inter?.data?.type || "Polyline"}>
                <Case value={"Circle"}>
                    <CircleEdit
                        data={inter?.data}
                        setData={v => handleChange(v)}
                    />
                </Case>
                <Case value={"Polyline"}>
                    <PolyLineEdit
                        data={inter?.data}
                        closed={false}
                        setData={v => handleChange(v)}
                    />
                </Case>
                <Case value={"Polygon"}>
                    <PolygonEdit
                        data={inter?.data}
                        closed={true}
                        setData={v => handleChange(v)}
                    />
                </Case>
            </SwitchCase>
        </Fragment>
    )
}