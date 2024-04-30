import { Rectangle } from "react-leaflet";
import { useEffect, useRef } from "react";
import "leaflet-draw";
import "../lib/Edit.SimpleShape";
import "../lib/Edit.Rectangle";

export const ImagePlacementStretcher = ({ imageData, setImageData }) => {
    const rectref = useRef();

    const { latnorth, latsouth, lngeast, lngwest } = imageData;

    useEffect(() => {
        rectref.current.editing.enable();
        rectref.current.on('edit', (e) => {
            const bounds = rectref.current._bounds;
            const newdata = {
                latnorth: bounds.getNorth(),
                latsouth: bounds.getSouth(),
                lngeast: bounds.getEast(),
                lngwest: bounds.getWest(),
            };
            const isChanged = Object.entries(newdata).find(([k, v]) => imageData[k] !== v);
            if (isChanged) {
                setImageData({ ...imageData, ...newdata });
            }
        })
        return () => rectref?.current?.off('edit');
    }, [])

    return (
        <>
            <Rectangle
                ref={rectref}
                bounds={[[latnorth, lngeast], [latsouth, lngwest]]}
                pathOptions={{ fill: false }}
            />
        </>
    )
}

//     <MarkerStretcher position={{ lat: latsouth, lng: lngeast }} dragPosition={({ lat, lng }) => setRect({ ...rect, latsouth: lat, lngeast: lng })} antipos={{ lat: latnorth, lng: lngwest }} />
//     <MarkerStretcher position={{ lat: latsouth, lng: lngwest }} dragPosition={({ lat, lng }) => setRect({ ...rect, latsouth: lat, lngwest: lng })} antipos={{ lat: latnorth, lng: lngeast }} />
//     <MarkerStretcher position={{ lat: latnorth, lng: lngeast }} dragPosition={({ lat, lng }) => setRect({ ...rect, latnorth: lat, lngeast: lng })} antipos={{ lat: latsouth, lng: lngwest }} />
// <MarkerStretcher position={{ lat: latnorth, lng: lngwest }} dragPosition={({ lat, lng }) => setRect({ ...rect, latnorth: lat, lngwest: lng })} antipos={{ lat: latsouth, lng: lngeast }} />

// const MarkerStretcher = ({ position, setPosition, dragPosition, antipos }) => {
//     const handleChangePosition = (e) => {
//         const clicked = pos2arr(e.target.getLatLng());
//         const anti = pos2arr(antipos);
//         const old = pos2arr(position);
//         const distToClicked = distance(anti, clicked);
//         const distToOld = distance(anti, old);
//         const n = lerpPoint(anti, old, distToClicked / distToOld);
//         const newpos = { lng: n[0], lat: n[1] };
//         dragPosition(newpos);
//     }

//     return (
//         <Marker
//             draggable={true}
//             position={position}
//             eventHandlers={{
//                 drag: handleChangePosition
//             }}
//             icon={CustomIcon()}
//         />
//     )
// }
