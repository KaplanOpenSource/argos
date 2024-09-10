import { Case, SwitchCase } from "../Utils/SwitchCase";
import { CircleEdit } from "./CircleEdit";
import { PolygonEdit, PolyLineEdit } from "./PolyEdit";

export const MapDrawShape = ({ data, setData }) => {
    return (
        <SwitchCase test={data?.type || "Polyline"}>
            <Case value={"Circle"}>
                <CircleEdit
                    data={data}
                    setData={v => setData(v)}
                />
            </Case>
            <Case value={"Polyline"}>
                <PolyLineEdit
                    data={data}
                    closed={false}
                    setData={v => setData(v)}
                />
            </Case>
            <Case value={"Polygon"}>
                <PolygonEdit
                    data={data}
                    closed={true}
                    setData={v => setData(v)}
                />
            </Case>
        </SwitchCase>
    )
}