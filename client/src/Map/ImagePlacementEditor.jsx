import { useState } from "react";
import { AnchorPointsDiagonal } from "./AnchorPointsDiagonal";
import { Tooltip } from "react-leaflet";
import { TextFieldDebounceOutlined } from "../Utils/TextFieldDebounce";
import { Stack } from "@mui/material";

export const ImagePlacementEditor = ({ imageData, setImageData }) => {
    const [anchor, setAnchor] = useState({ lat: imageData.ybottom, lng: imageData.xleft, x: 0, y: 0 });
    const [anotherPoint, setAnotherPoint] = useState({ lat: imageData.ybottom, lng: imageData.xright, x: imageData.width, y: 0 });

    const round9 = (n) => {
        return Math.round(n * 1e9) / 1e9;
    }

    const roundDec = (num) => {
        return Math.round(num * 1000) / 1000;
    }

    const calcPointXY = ({ lat, lng }) => {
        const x = (lng - imageData.xleft) / (imageData.xright - imageData.xleft) * imageData.width;
        const y = (lat - imageData.ybottom) / (imageData.ytop - imageData.ybottom) * imageData.height;
        return ({ lat, lng, x, y });
    }

    const distLatLng = (p0, p1) => {
        return Math.sqrt(Math.pow(p0.lat - p1.lat, 2) + Math.pow(p0.lng - p1.lng, 2));
    }

    const distXY = (p0, p1) => {
        return Math.sqrt(Math.pow(p0.x - p1.x, 2) + Math.pow(p0.y - p1.y, 2));
    }

    const changeDistMeters = (newDist) => {
        const dxy = distXY(anotherPoint, anchor);
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

    const changeDistPixels = (newDist) => {
        const dxy = distXY(anotherPoint, anchor);
        if (newDist > 1e-3 && dxy > 1e-3) {
            const factorOldToNew = newDist / dxy;
            const dlng = (anotherPoint.lng - anchor.lng) * factorOldToNew;
            const dlat = (anotherPoint.lat - anchor.lat) * factorOldToNew;
            const lng = anchor.lng + dlng;
            const lat = anchor.lat + dlat;
            setAnotherPoint(calcPointXY({ lng, lat }));
        }
    }

    return (
        <AnchorPointsDiagonal
            anchorLatLng={{ lat: anchor.lat, lng: anchor.lng }}
            anotherLatLng={{ lat: anotherPoint.lat, lng: anotherPoint.lng }}
            anchorXY={{ x: anchor.x, y: anchor.y }}
            anotherXY={{ x: anotherPoint.x, y: anotherPoint.y }}
            setAnchorLatLng={({ lat, lng }) => setAnchor(calcPointXY({ lat, lng }))}
            setAnotherLatLng={({ lat, lng }) => setAnotherPoint(calcPointXY({ lat, lng }))}
        >
            <Tooltip
                position={{ lat: (anchor.lat + anotherPoint.lat) / 2, lng: (anchor.lng + anotherPoint.lng) / 2 }}
                permanent={true}
                direction="top"
                interactive={true}
            >
                <Stack>
                    <TextFieldDebounceOutlined
                        InputProps={{ style: { width: '150px' } }}
                        label="Span in meters"
                        value={roundDec(distLatLng(anchor, anotherPoint))}
                        onChange={(newDist) => changeDistMeters(newDist)}
                    />
                    <TextFieldDebounceOutlined
                        InputProps={{ style: { width: '150px' } }}
                        label="Span in Pixels"
                        value={roundDec(distXY(anchor, anotherPoint))}
                        onChange={(newDist) => changeDistPixels(newDist)}
                    />
                </Stack>
            </Tooltip>
        </AnchorPointsDiagonal>
    )
}

export const ImagePlacementEditorLngLat = ({ imageData, setImageData, ...props }) => {
    const { width, height, lngwest, lngeast, latnorth, latsouth } = imageData;
    const xyData = { width, height, xleft: lngwest, xright: lngeast, ytop: latnorth, ybottom: latsouth };
    const setXyData = (newData) => {
        const { ybottom, ytop, xleft, xright } = newData;
        setImageData({ ...imageData, latsouth: ybottom, latnorth: ytop, lngwest: xleft, lngeast: xright })
    };
    return (
        <ImagePlacementEditor
            imageData={xyData}
            setImageData={setXyData}
            {...props}
        />
    )
}