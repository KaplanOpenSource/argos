import { useState } from "react";
import { AnchorPointsDiagonal } from "./AnchorPointsDiagonal";
import { Tooltip } from "react-leaflet";
import { TextFieldDebounceOutlined } from "../Utils/TextFieldDebounce";
import { Stack } from "@mui/material";
import { distLatLngPythagoras, distXY, round9, roundDec } from "../Utils/GeometryUtils";
import { IImageStandalone } from "../types/types";
import React from "react";

export const ImagePlacementEditor = ({
    imageData,
    setImageData,
    startDiagonal = false,
    distLatLng = distLatLngPythagoras,
}: {
    imageData: IImageStandalone,
    setImageData: (newData: IImageStandalone) => void,
    startDiagonal: boolean,
    distLatLng: (p0: any, p1: any) => number,
}) => {
    const xleft = imageData.xleft ?? 0;
    const ybottom = imageData.ybottom ?? 0;
    const xright = imageData.xright ?? 400;
    const ytop = imageData.ytop ?? 300;
    const height = imageData.height ?? 300;
    const width = imageData.width ?? 400;

    const [anchor, setAnchor] = useState({
        lat: ybottom,
        lng: xleft,
        x: 0,
        y: 0,
    });
    const [anotherPoint, setAnotherPoint] = useState({
        lat: startDiagonal ? ytop : ybottom,
        lng: xright,
        x: width,
        y: startDiagonal ? height : 0,
    });

    const calcPointXY = ({ lat, lng }) => {
        const x = (lng - xleft) / (xright - xleft) * width;
        const y = (lat - ybottom) / (ytop - ybottom) * height;
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
        const right = round9(left + width * factorPixelToMeter);
        const upper = round9(lower + height * factorPixelToMeter);
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
                        InputProps={{ style: { height: '30px', width: '120px' } }}
                        label="Span in meters"
                        value={roundDec(distLatLng(anchor, anotherPoint))}
                        onChange={(newDist) => changeDistMeters(newDist)}
                    />
                    <TextFieldDebounceOutlined
                        InputProps={{ style: { height: '30px', width: '120px' } }}
                        label="Span in Pixels"
                        value={roundDec(distXY(anchor, anotherPoint))}
                        onChange={(newDist) => changeDistPixels(newDist)}
                    />
                </Stack>
            </Tooltip>
        </AnchorPointsDiagonal>
    )
}
