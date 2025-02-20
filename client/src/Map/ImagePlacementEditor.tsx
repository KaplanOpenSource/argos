import React, { useState } from "react";
import { Stack } from "@mui/material";
import { Tooltip } from "react-leaflet";
import { distLatLngPythagoras, distXY, round9, roundDec } from "../Utils/GeometryUtils";
import { TextFieldDebounceOutlined } from "../Utils/TextFieldDebounce";
import { IImageStandalone } from "../types/types";
import { ChosenMarker } from "./ChosenMarker";
import { DashedPolyline } from "./DashedPolyline";
import { MarkedPoint } from "./MarkedPoint";

interface IAnchorPoint {
    lat: number,
    lng: number,
    x: number,
    y: number,
};

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

    const [anchor, setAnchor] = useState<IAnchorPoint>({
        lat: ybottom,
        lng: xleft,
        x: 0,
        y: 0,
    });
    const [anotherPoint, setAnotherPoint] = useState<IAnchorPoint>({
        lat: startDiagonal ? ytop : ybottom,
        lng: xright,
        x: width,
        y: startDiagonal ? height : 0,
    });

    const calcPointXY = ({ lat, lng }: { lat: number, lng: number }): IAnchorPoint => {
        const x = (lng - xleft) / (xright - xleft) * width;
        const y = (lat - ybottom) / (ytop - ybottom) * height;
        return ({ lat, lng, x, y });
    }

    const changeDistMeters = (newDist: number): void => {
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

    const changeDistPixels = (newDist: number): void => {
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
        <>
            <ChosenMarker center={[anchor.lat, anchor.lng]}>
                <MarkedPoint
                    location={[anchor.lat, anchor.lng]}
                    setLocation={([lat, lng]) => setAnchor(calcPointXY({ lat, lng }))}
                    locationToShow={`(${round9(anchor.lng)}, ${round9(anchor.lat)}) in meters<br/>(${round9(anchor.x)}, ${round9(anchor.y)}) in pixels`}
                />
            </ChosenMarker>
            <MarkedPoint
                location={[anotherPoint.lat, anotherPoint.lng]}
                setLocation={([lat, lng]) => setAnotherPoint(calcPointXY({ lat, lng }))}
                locationToShow={`(${round9(anotherPoint.lng)}, ${round9(anotherPoint.lat)}) in meters<br/>(${round9(anotherPoint.x)}, ${round9(anotherPoint.y)}) in pixels`}
            />
            <DashedPolyline
                positions={[
                    anchor,
                    anotherPoint
                ]}
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
            </DashedPolyline>
        </>
    )
}
