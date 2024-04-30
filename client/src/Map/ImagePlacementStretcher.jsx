import { CircleMarker, Marker, Polyline } from "react-leaflet";
import { distance, lerp, lerpPoint, pos2arr } from "../Utils/GeometryUtils";
import { useEffect, useState } from "react";
import { LineUtil, Point, latLng } from "leaflet";

const MarkerStretcher = ({ position, setPosition, antipos }) => {
    const [pos, setpos] = useState(position)

    const handleChangePosition = (e) => {
        setpos(e.target.getLatLng())
        const clicked = pos2arr(e.target.getLatLng());
        const anti = pos2arr(antipos);
        const old = pos2arr(position);
        const distToClicked = distance(anti, clicked);
        const distToOld = distance(anti, old);
        const n = lerpPoint(anti, old, distToClicked / distToOld);
        const newpos = { lng: n[0], lat: n[1] };
        setPosition(newpos);
    }

    return (
        <Marker
            draggable={true}
            position={position}
            eventHandlers={{
                dragend: handleChangePosition
            }}
        />
    )
}
export const ImagePlacementStretcher = ({ imageData, setImageData }) => {
    const { latnorth, latsouth, lngeast, lngwest } = imageData;
    // console.log(imageData);
    return (
        <>
            <MarkerStretcher position={{ lat: latsouth, lng: lngeast }} setPosition={({ lat, lng }) => setImageData({ ...imageData, latsouth: lat, lngeast: lng })} antipos={{ lat: latnorth, lng: lngwest }} />
            <MarkerStretcher position={{ lat: latsouth, lng: lngwest }} setPosition={({ lat, lng }) => setImageData({ ...imageData, latsouth: lat, lngwest: lng })} antipos={{ lat: latnorth, lng: lngeast }} />
            <MarkerStretcher position={{ lat: latnorth, lng: lngeast }} setPosition={({ lat, lng }) => setImageData({ ...imageData, latnorth: lat, lngeast: lng })} antipos={{ lat: latsouth, lng: lngwest }} />
            <MarkerStretcher position={{ lat: latnorth, lng: lngwest }} setPosition={({ lat, lng }) => setImageData({ ...imageData, latnorth: lat, lngwest: lng })} antipos={{ lat: latsouth, lng: lngeast }} />
        </>
    )
}