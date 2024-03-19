import { useState } from "react";
import { AnchorPointsDiagonal } from "./AnchorPointsDiagonal";

export const ImagePlacementEditor = ({ experiment, image }) => {
    const [anchor, setAnchor] = useState({ lat: image.ybottom, lng: image.xleft, x: 0, y: 0 });
    const [anotherPoint, setAnotherPoint] = useState({ lat: image.ybottom, lng: image.xright, x: image.width, y: 0 });

    const round9 = (n) => {
        return Math.round(n * 1e9) / 1e9;
    }

    const roundDec = (num) => {
        return Math.round(num * 1000) / 1000;
    }

    const setPointWithoutChange = (setter, lat, lng) => {
        const x = (lng - image.xleft) / (image.xright - image.xleft) * image.width;
        const y = (lat - image.ybottom) / (image.ytop - image.ybottom) * image.height;
        setter({ lat, lng, x, y });
    }

    return (<AnchorPointsDiagonal
        anchorLatLng={{ lat: anchor.lat, lng: anchor.lng }}
        anotherLatLng={{ lat: anotherPoint.lat, lng: anotherPoint.lng }}
        anchorXY={{ x: anchor.x, y: anchor.y }}
        anotherXY={{ x: anotherPoint.x, y: anotherPoint.y }}
        setAnchorLatLng={({ lat, lng }) => setPointWithoutChange(setAnchor, lat, lng)}
        setAnotherLatLng={({ lat, lng }) => setPointWithoutChange(setAnotherPoint, lat, lng)}
    ></AnchorPointsDiagonal>
    )
}