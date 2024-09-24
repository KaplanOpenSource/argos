import { Circle, Tooltip } from "react-leaflet";
import { useEffect, useRef } from "react";
import "leaflet-draw";
import "../lib/Edit.SimpleShape";
import "../lib/Edit.CircleMarker";
import "../lib/Edit.Circle";
import { DEFAULT_COLOR, DEFAULT_FILL_OPACITY, DEFAULT_LINE_OPACITY } from "./defaults";

export const CircleEdit = ({ data, setData }) => {
    const ref = useRef();

    const { radius, center } = data || {};

    useEffect(() => {
        ref?.current?.editing?.enable();
        ref?.current?.on('edit', (e) => {
            if (setData) {
                setData({
                    ...data,
                    radius: ref.current._mRadius,
                    center: [ref.current._latlng.lat, ref.current._latlng.lng],
                });
            }
        })
        return () => ref?.current?.off('edit');
    }, [])

    return (
        <>
            {(center?.length >= 2 && radius > 0)
                ?
                <Circle
                    ref={ref}
                    center={center}
                    radius={radius}
                    fillOpacity={data?.fillOpacity ?? DEFAULT_FILL_OPACITY}
                    opacity={data?.lineOpacity ?? DEFAULT_LINE_OPACITY}
                    color={data?.lineColor ?? DEFAULT_COLOR}
                    fillColor={data?.fillColor ?? DEFAULT_COLOR}        
                >
                    <Tooltip>
                        {data.name}
                    </Tooltip>
                </Circle>
                : null
            }
        </>
    )
}
