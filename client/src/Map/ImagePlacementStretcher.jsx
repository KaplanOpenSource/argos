import { CircleMarker, Marker, Polyline } from "react-leaflet";
import { distance, lerp, lerpPoint, pos2arr } from "../Utils/GeometryUtils";
import { useEffect, useState } from "react";
import { LineUtil, Point, latLng } from "leaflet";

const MarkerStretcher = ({ position, setPosition, antipos }) => {
    const [pos, setpos] = useState(position)
    // const position = {
    //     lat: imageData[fieldNameLat],
    //     lng: imageData[fieldNameLng],
    // };

    // const setPosition = ({ lat, lng }) => {
    //     setImageData({
    //         ...imageData,
    //         [fieldNameLat]: lat,
    //         [fieldNameLng]: lng
    //     })
    // };

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
                // dragend: e => setImageData({
                //     ...imageData,
                //     [fieldNameLat]: e.target.getLatLng().lat,
                //     [fieldNameLng]: e.target.getLatLng().lng
                // })
            }}
        />
    )
}
export const ImagePlacementStretcher = ({ imageData, setImageData }) => {
    const { latnorth, latsouth, lngeast, lngwest } = imageData;
    // console.log(imageData);
    return (
        <>
            <MarkerStretcher
                position={{ lat: latsouth, lng: lngeast }}
                setPosition={({ lat, lng }) => setImageData({ ...imageData, latsouth: lat, lngeast: lng })}
                antipos={{ lat: latnorth, lng: lngwest }}
            />
            {/* // imageData={imageData} setImageData={setImageData} fieldNameLat={'latsouth'} fieldNameLng={'lngeast'} /> */}
            {/* <MarkerStretcher imageData={imageData} setImageData={setImageData} fieldNameLat={'latnorth'} fieldNameLng={'lngeast'} />
            <MarkerStretcher imageData={imageData} setImageData={setImageData} fieldNameLat={'latsouth'} fieldNameLng={'lngwest'} />
            <MarkerStretcher imageData={imageData} setImageData={setImageData} fieldNameLat={'latnorth'} fieldNameLng={'lngwest'} /> */}
        </>
    )
}