import { useState } from "react";
import { AnchorPointsDiagonal } from "./AnchorPointsDiagonal";
import { Tooltip } from "react-leaflet";
import { TextFieldDebounceOutlined } from "../Utils/TextFieldDebounce";
import { Stack } from "@mui/material";
import { latLng } from "leaflet";
import { distLatLngPythagoras, distXY, round9, roundDec } from "../Utils/GeometryUtils";

const calcBoxFromSpecificCoords = (lat0, lng0, lat1, lng1, x0, y0, x1, y1, xsize, ysize) => {
    if (Math.abs(x1 - x0) < 1e-6 || Math.abs(y1 - y0) < 1e-6) {
        alert("Control points have similar X or Y coord");
        return false;
    }
    const right = lng0 + (lng1 - lng0) / (x1 - x0) * (xsize - x0);
    const left = lng1 - (lng1 - lng0) / (x1 - x0) * x1;
    const lower = lat0 + (lat1 - lat0) / (y1 - y0) * (ysize - y0);
    const upper = lat1 - (lat1 - lat0) / (y1 - y0) * y1;
    return { lower, right, upper, left };
}

// const calcBoxFromPoints = (p0, p1, imageSize) => {
//     return calcBoxFromSpecificCoords(
//         p0.lat, p0.lng,
//         p1.lat, p1.lng,
//         p0.x, p0.y,
//         p1.x, p1.y,
//         imageSize.x, imageSize.y);
// }


export const ImagePlacementEditor = ({ imageData, setImageData, startDiagonal = false, distLatLng = distLatLngPythagoras }) => {
    const [anchor, setAnchor] = useState({
        lat: imageData.ybottom,
        lng: imageData.xleft,
        x: 0,
        y: 0,
    });
    const [anotherPoint, setAnotherPoint] = useState({
        lat: startDiagonal ? imageData.ytop : imageData.ybottom,
        lng: imageData.xright,
        x: imageData.width,
        y: startDiagonal ? imageData.height : 0,
    });

    const calcPointXY = ({ lat, lng }) => {
        const x = (lng - imageData.xleft) / (imageData.xright - imageData.xleft) * imageData.width;
        const y = (lat - imageData.ybottom) / (imageData.ytop - imageData.ybottom) * imageData.height;
        return ({ lat, lng, x, y });
    }

    const changeDistMeters = (newDist) => {
        const dxy = distXY(anotherPoint, anchor);
        if (newDist < 1e-3 || dxy < 1e-3) {
            return;
        }
        const oldDist = distLatLng(anchor, anotherPoint);
        const factorOldToNew = newDist / oldDist;
        const dlng = (anotherPoint.lng - anchor.lng) * factorOldToNew;
        const dlat = (anotherPoint.lat - anchor.lat) * factorOldToNew;
        const lng = anchor.lng + dlng;
        const lat = anchor.lat + dlat;

        const dlnglat = distLatLngPythagoras(anchor, { lng, lat });
        const factorPixelToMeter = dlnglat / dxy;
        const left = round9(anchor.lng - anchor.x * factorPixelToMeter);
        const lower = round9(anchor.lat - anchor.y * factorPixelToMeter);
        const right = round9(left + imageData.width * factorPixelToMeter);
        const upper = round9(lower + imageData.height * factorPixelToMeter);
        setImageData({ ...imageData, ybottom: lower, ytop: upper, xleft: left, xright: right });

        setAnotherPoint({ ...anotherPoint, lng, lat });
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
            distLatLng={(p1, p2) => latLng(p1).distanceTo(latLng(p2))}
            {...props}
        />
    )
}