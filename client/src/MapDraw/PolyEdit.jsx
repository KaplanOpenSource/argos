import { Polygon, Polyline } from "react-leaflet";
import { useEffect, useRef } from "react";
import "leaflet-draw";
import "../lib/Edit.SimpleShape";
import "../lib/Edit.Poly";

const refcurrToCoords = (refcurr) => {
    return refcurr.editing._verticesHandlers[0]._markers.map(x => [x._latlng.lat, x._latlng.lng]);
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
            positions={data?.coordinates || []}
        />
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
            positions={data?.coordinates || []}
        />
    )
}
