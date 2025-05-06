import { Polygon, Polyline, Tooltip } from "react-leaflet";
import { useEffect, useRef } from "react";
import "leaflet-draw";
import "../lib/Edit.SimpleShape";
import "../lib/Edit.Poly";
import { DEFAULT_COLOR, DEFAULT_FILL_OPACITY, DEFAULT_LINE_OPACITY } from "./defaults";

const refcurrToCoords = (refcurr) => {
    return refcurr.editing._verticesHandlers[0]._markers.map(x => [x._latlng.lat, x._latlng.lng]);
}

const sanitizeCoords = (coordinates) => {
    return coordinates?.filter(x => x?.length === 2 && Number.isFinite(x[0]) && Number.isFinite(x[1])) || []
}

export const PolyLineEdit = ({ data, setData }) => {
    const ref = useRef();

    useEffect(() => {
        ref?.current?.editing?.enable();
        ref?.current?.on('edit', (e) => {
            if (setData) {
                setData({ ...data, coordinates: refcurrToCoords(ref.current) });
            }
        })
        return () => ref?.current?.off('edit');
    }, [])

    return (
        <Polyline
            ref={ref}
            positions={sanitizeCoords(data?.coordinates)}
            fillOpacity={data?.fillOpacity ?? DEFAULT_FILL_OPACITY}
            opacity={data?.lineOpacity ?? DEFAULT_LINE_OPACITY}
            color={data?.lineColor ?? DEFAULT_COLOR}
            fillColor={data?.fillColor ?? DEFAULT_COLOR}
        >
            <Tooltip>
                {data.name}
            </Tooltip>
        </Polyline>
    )
}

export const PolygonEdit = ({ data, setData }) => {
    const ref = useRef();

    useEffect(() => {
        ref?.current?.editing?.enable();
        ref?.current?.on('edit', (e) => {
            if (setData) {
                setData({ ...data, coordinates: refcurrToCoords(ref.current) });
            }
        })
        return () => ref?.current?.off('edit');
    }, [])

    return (
        <Polygon
            ref={ref}
            positions={sanitizeCoords(data?.coordinates)}
            fillOpacity={data?.fillOpacity ?? DEFAULT_FILL_OPACITY}
            opacity={data?.lineOpacity ?? DEFAULT_LINE_OPACITY}
            color={data?.lineColor ?? DEFAULT_COLOR}
            fillColor={data?.fillColor ?? DEFAULT_COLOR}
        >
            <Tooltip>
                {data.name}
            </Tooltip>
        </Polygon>
    )
}
