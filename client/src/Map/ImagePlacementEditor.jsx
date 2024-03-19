import { useState } from "react";
import { AnchorPointsDiagonal } from "./AnchorPointsDiagonal";
import { Popup } from "react-leaflet";
import { TextFieldDebounceOutlined } from "../Utils/TextFieldDebounce";

export const ImagePlacementEditor = ({ experiment, imageData, setImageData }) => {
    const [anchor, setAnchor] = useState({ lat: imageData.ybottom, lng: imageData.xleft, x: 0, y: 0 });
    const [anotherPoint, setAnotherPoint] = useState({ lat: imageData.ybottom, lng: imageData.xright, x: imageData.width, y: 0 });

    const round9 = (n) => {
        return Math.round(n * 1e9) / 1e9;
    }

    const roundDec = (num) => {
        return Math.round(num * 1000) / 1000;
    }

    const setPointWithoutChange = (setter, lat, lng) => {
        const x = (lng - imageData.xleft) / (imageData.xright - imageData.xleft) * imageData.width;
        const y = (lat - imageData.ybottom) / (imageData.ytop - imageData.ybottom) * imageData.height;
        setter({ lat, lng, x, y });
    }


    const distLatLng = (p0, p1) => {
        return Math.sqrt(Math.pow(p0.lat - p1.lat, 2) + Math.pow(p0.lng - p1.lng, 2));
    }

    const distXY = (p0, p1) => {
        return Math.sqrt(Math.pow(p0.x - p1.x, 2) + Math.pow(p0.y - p1.y, 2));
    }

    const changeDist = (newDist) => {
        const dxy = distXY(anotherPoint, anchor);
        // const dx = Math.abs(anotherPoint.x - anchor.x);
        // const dy = Math.abs(anotherPoint.y - anchor.y);
        if (newDist > 1e-3 && dxy > 1e-3) {

            const oldDist = distLatLng(anchor, anotherPoint);
            const factorOldToNew = newDist / oldDist;
            const dlng = (anotherPoint.lng - anchor.lng) * factorOldToNew;
            const dlat = (anotherPoint.lat - anchor.lat) * factorOldToNew;

            const factorPixelToMeter = newDist / dxy;
            const left = round9(anchor.lng - anchor.x * factorPixelToMeter);
            const lower = round9(anchor.lat - anchor.y * factorPixelToMeter);
            const right = round9(left + imageData.width * factorPixelToMeter);
            const upper = round9(lower + imageData.height * factorPixelToMeter);
            setImageData({ ...imageData, ybottom: lower, ytop: upper, xleft: left, xright: right });

            const lng = anchor.lng + dlng;
            const lat = anchor.lat + dlat;
            setAnotherPoint({ ...anotherPoint, lng, lat });
        }
    }

    return (
        <AnchorPointsDiagonal
            anchorLatLng={{ lat: anchor.lat, lng: anchor.lng }}
            anotherLatLng={{ lat: anotherPoint.lat, lng: anotherPoint.lng }}
            anchorXY={{ x: anchor.x, y: anchor.y }}
            anotherXY={{ x: anotherPoint.x, y: anotherPoint.y }}
            setAnchorLatLng={({ lat, lng }) => setPointWithoutChange(setAnchor, lat, lng)}
            setAnotherLatLng={({ lat, lng }) => setPointWithoutChange(setAnotherPoint, lat, lng)}
        >
            <Popup>
                <TextFieldDebounceOutlined
                    InputProps={{ style: { width: '100px' } }}
                    label="Span in meters"
                    value={roundDec(distLatLng(anchor, anotherPoint))}
                    onChange={(newDist) => changeDist(newDist)}
                />
            </Popup>
        </AnchorPointsDiagonal>
    )
}