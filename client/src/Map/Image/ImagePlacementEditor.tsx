import React, { useContext, useState } from "react";
import { Stack } from "@mui/material";
import { Popup, Tooltip, useMap } from "react-leaflet";
import { distLatLngPythagoras, distXY, round9, roundDec } from "../../Utils/GeometryUtils";
import { TextFieldDebounceOutlined } from "../../Utils/TextFieldDebounce";
import { IExperiment, IImageStandalone } from "../../types/types";
import { ChosenMarker } from "../ChosenMarker";
import { DashedPolyline } from "../DashedPolyline";
import { MarkedPoint } from "../MarkedPoint";
import { experimentContext } from "../../Context/ExperimentProvider";
import { IAnchorPoint } from "./IAnchorPoint";
import { ImagePointEdit } from "./ImagePointEdit";
import { ComputedImageData } from "./ComputedImageData";

export const ImagePlacementEditor = ({
    imageData,
    experiment,
    setExperiment,
    shownMapIndex,
    distLatLng = distLatLngPythagoras,
}: {
    imageData: IImageStandalone,
    experiment: IExperiment,
    setExperiment: (newExperimentData: IExperiment) => void,
    shownMapIndex: number,
    distLatLng: (p0: any, p1: any) => number,
}) => {
    const mapObj = useMap();
    const { currTrial } = useContext(experimentContext)

    const data = new ComputedImageData(imageData);

    const experimentChangedImage = (newImageData: Partial<IImageStandalone>): { newExp: IExperiment; newData: IImageStandalone; } => {
        const newExp = structuredClone(experiment);
        newExp.imageStandalone ||= [];
        const newData = { ...imageData, ...newImageData };
        newExp.imageStandalone[shownMapIndex] = newData;
        return { newExp, newData };
    };

    const [anchor, setAnchor] = useState<IAnchorPoint>(() => data.calcXY({ lat: data.data.ytop, lng: data.data.xleft }));
    const [anotherPoint, setAnotherPoint] = useState<IAnchorPoint>(() => data.calcXY({ lat: data.data.ytop, lng: data.data.xright }));
    const [zeroPoint, setZeroPoint] = useState<IAnchorPoint>(() => data.calcXY({ lat: 0, lng: 0 }));

    const anchorToStr = (p: IAnchorPoint): string => {
        return `(${roundDec(p.lng)}, ${roundDec(p.lat)}) in meters<br/>(${roundDec(p.x)}, ${roundDec(p.y)}) in pixels`;
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
        const right = round9(left + data.data.width * factorPixelToMeter);
        const upper = round9(lower + data.data.height * factorPixelToMeter);

        setExperiment(experimentChangedImage({
            ybottom: lower,
            ytop: upper,
            xleft: left,
            xright: right,
        }).newExp);

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
            setAnotherPoint(data.calcXY({ lng, lat }));
        }
    }

    const changeZeroPoint = (lat: number, lng: number) => {
        const center = mapObj.getCenter();

        mapObj.setView([center.lat - lat, center.lng - lng], undefined, { animate: false });

        const { newExp, newData } = experimentChangedImage({
            ybottom: data.data.ybottom - lat,
            ytop: data.data.ytop - lat,
            xleft: data.data.xleft - lng,
            xright: data.data.xright - lng,
        });

        const compData = new ComputedImageData(newData);
        setAnchor(compData.calcLatLng(anchor));
        setAnotherPoint(compData.calcLatLng(anotherPoint));
        setZeroPoint(compData.calcXY(zeroPoint));
        if (currTrial?.trial) {
            const trial = newExp?.trialTypes?.at(currTrial?.trialTypeIndex)?.trials?.at(currTrial?.trialIndex);
            for (const d of trial?.devicesOnTrial || []) {
                const coordinates = d?.location?.coordinates;
                if (coordinates && d?.location?.name === imageData.name) {
                    coordinates[0] = compData.calcLat(data.calcY(coordinates[0]));
                    coordinates[1] = compData.calcLng(data.calcX(coordinates[1]));
                }
            }
        }

        setExperiment(newExp);
    }

    return (
        <>
            <ChosenMarker center={[anchor.lat, anchor.lng]}>
                <MarkedPoint
                    location={[anchor.lat, anchor.lng]}
                    setLocation={([lat, lng]) => setAnchor(data.calcXY({ lat, lng }))}
                    locationToShow={"Measure anchor 0:<br/>" + anchorToStr(anchor)}
                />
            </ChosenMarker>
            <ChosenMarker center={[anotherPoint.lat, anotherPoint.lng]} color="green">
                <MarkedPoint
                    location={[anotherPoint.lat, anotherPoint.lng]}
                    setLocation={([lat, lng]) => setAnotherPoint(data.calcXY({ lat, lng }))}
                    locationToShow={"Measure anchor 1:<br/>" + anchorToStr(anotherPoint)}
                />
            </ChosenMarker>
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
            <ChosenMarker center={[zeroPoint.lat, zeroPoint.lng]} color="blue">
                <MarkedPoint
                    location={[zeroPoint.lat, zeroPoint.lng]}
                    locationToShow={"zero point:<br/>" + anchorToStr(zeroPoint)}
                    setLocation={([lat, lng]) => changeZeroPoint(lat, lng)}
                >
                    <Popup>
                        <ImagePointEdit
                            label="Zero Point"
                            point={zeroPoint}
                            disabledXy={true}
                            setLatLng={({lat, lng}) => setZeroPoint(data.calcXY({ lat, lng }))}
                        />
                    </Popup>
                </MarkedPoint>
            </ChosenMarker>
        </>
    )
}
