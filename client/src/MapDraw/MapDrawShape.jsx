import { Case, SwitchCase } from "../Utils/SwitchCase";
import { Circle, Polygon, Polyline } from "react-leaflet";
import { CircleEdit } from "./CircleEdit";

export const MapDrawShape = ({ data, setData }) => {
    return (
        <SwitchCase test={data?.type || "Polyline"}>
            <Case value={"Circle"}>
                {(data?.center?.length >= 2 && data?.radius > 0)
                    ?
                    <>
                        <Circle
                            center={data.center}
                            radius={data.radius}
                        />
                        <CircleEdit
                            data={data}
                            setData={v => setData(v)}
                        />
                    </>
                    : null
                }
            </Case>
            <Case value={"Polyline"}>
                {(data?.coordinates?.length > 0)
                    ?
                    <Polyline
                        positions={data.coordinates}
                    />
                    : null
                }
            </Case>
            <Case value={"Polygon"}>
                {(data?.coordinates?.length > 0)
                    ?
                    <Polygon
                        positions={data.coordinates}
                    />
                    : null
                }
            </Case>
        </SwitchCase>
    )
}