import React, { useContext, useState } from "react";
import { Stack } from "@mui/material";
import { Popup, Tooltip, useMap } from "react-leaflet";
import { distLatLngPythagoras, distXY, round9, roundDec } from "../Utils/GeometryUtils";
import { TextFieldDebounceOutlined } from "../Utils/TextFieldDebounce";
import { IExperiment, IImageStandalone } from "../types/types";
import { ChosenMarker } from "./ChosenMarker";
import { DashedPolyline } from "./DashedPolyline";
import { MarkedPoint } from "./MarkedPoint";
import { experimentContext } from "../Context/ExperimentProvider";

interface IAnchorPoint {
    lat: number,
    lng: number,
    x: number,
    y: number,
};

type IImageBounds = Required<Omit<IImageStandalone, 'name' | 'filename'>>;
class ComputedImageData {
    public readonly data: IImageBounds;
    private readonly xspan: number;
    private readonly yspan: number;

    constructor(imageData: IImageStandalone) {
        this.data = {
            xleft: imageData.xleft ?? 0,
            ybottom: imageData.ybottom ?? 0,
            xright: imageData.xright ?? 400,
            ytop: imageData.ytop ?? 300,
            height: imageData.height ?? 300,
            width: imageData.width ?? 400,
        }
        this.xspan = this.data.xright - this.data.xleft;
        this.yspan = this.data.ytop - this.data.ybottom;
    }
    public calcXY = ({ lat, lng }: { lat: number, lng: number }): IAnchorPoint => {
        const x = (lng - this.data.xleft) / this.xspan * this.data.width;
        const y = (lat - this.data.ybottom) / this.yspan * this.data.height;
        return ({ lat, lng, x, y });
    }
    public calcLatLng = ({ x, y }: { x: number, y: number }): IAnchorPoint => {
        const lng = x * this.xspan / this.data.width + this.data.xleft;
        const lat = y * this.yspan / this.data.height + this.data.ybottom;
        return { x, y, lat, lng };
    }
};

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

    const experimentChangedImage = (newImageData: Partial<IImageStandalone>) => {
        const exp = structuredClone(experiment);
        exp.imageStandalone ||= [];
        exp.imageStandalone[shownMapIndex] = { ...imageData, ...newImageData };
        return exp;
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
        }));

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

        const exp = experimentChangedImage({
            ybottom: data.data.ybottom - lat,
            ytop: data.data.ytop - lat,
            xleft: data.data.xleft - lng,
            xright: data.data.xright - lng,
        });
        if (currTrial?.trial) {
            const trial = exp?.trialTypes?.at(currTrial?.trialTypeIndex)?.trials?.at(currTrial?.trialIndex);
            for (const d of trial?.devicesOnTrial || []) {
                if (d?.location?.coordinates && d?.location?.name === imageData.name) {
                    d.location.coordinates[0] -= lat;
                    d.location.coordinates[1] -= lng;
                }
            }
        }
        setExperiment(exp);

        const newData = new ComputedImageData(exp.imageStandalone![shownMapIndex]);
        setAnchor(newData.calcLatLng(anchor));
        setAnotherPoint(newData.calcLatLng(anotherPoint));
        setZeroPoint(newData.calcXY(zeroPoint));
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
                        <Stack direction='column' spacing={1}>
                            <span>Zeropoint:</span>
                            <Stack direction='row' spacing={1} alignItems={'center'}>
                                <span style={{ width: 120 }}>Location in meters:</span>
                                <TextFieldDebounceOutlined
                                    style={{ marginLeft: 0 }}
                                    InputProps={{ style: { height: '30px', width: '90px' } }}
                                    label="X"
                                    value={roundDec(zeroPoint.lng)}
                                    onChange={(newVal: number) => {
                                        setZeroPoint(data.calcXY({ lat: zeroPoint.lat, lng: newVal }));
                                    }}
                                    disabled={true}
                                />
                                <TextFieldDebounceOutlined
                                    InputProps={{ style: { height: '30px', width: '90px' } }}
                                    label="Y"
                                    value={roundDec(zeroPoint.lat)}
                                    onChange={(newVal: number) => {
                                        setZeroPoint(data.calcXY({ lat: newVal, lng: zeroPoint.lng }));
                                    }}
                                    disabled={true}
                                />
                            </Stack>
                            <Stack direction='row' spacing={1} alignItems={'center'}>
                                <span style={{ width: 120 }}>Location in pixels:</span>
                                <TextFieldDebounceOutlined
                                    style={{ marginLeft: 0 }}
                                    InputProps={{ style: { height: '30px', width: '90px' } }}
                                    label="X"
                                    value={roundDec(zeroPoint.x)}
                                    disabled={true}
                                />
                                <TextFieldDebounceOutlined
                                    InputProps={{ style: { height: '30px', width: '90px' } }}
                                    label="Y"
                                    value={roundDec(zeroPoint.y)}
                                    disabled={true}
                                />
                            </Stack>
                        </Stack>
                    </Popup>
                </MarkedPoint>
            </ChosenMarker>
        </>
    )
}
