import { Stack } from "@mui/material";
import React, { useState } from "react";
import { Popup, Tooltip, useMap } from "react-leaflet";
import { useChosenTrial } from "../../Context/useChosenTrial";
import { distLatLngPythagoras, distXY, round9, roundDec } from "../../Utils/GeometryUtils";
import { TextFieldDebounceOutlined } from "../../Utils/TextFieldDebounce";
import { IExperiment, IImageStandalone } from "../../types/types";
import { ChosenMarker } from "../ChosenMarker";
import { DashedPolyline } from "../DashedPolyline";
import { MarkedPoint } from "../MarkedPoint";
import { ComputedImageData } from "./ComputedImageData";
import { IAnchorPoint } from "./IAnchorPoint";
import { ImagePointEdit } from "./ImagePointEdit";

export const ImagePlacementEditor = ({
  imageData,
  experiment,
  setExperiment,
  distLatLng = distLatLngPythagoras,
}: {
  imageData: IImageStandalone,
  experiment: IExperiment,
  setExperiment: (newExperimentData: IExperiment) => void,
  distLatLng: (p0: any, p1: any) => number,
}) => {
  const mapObj = useMap();
  const { isTrialChosen, obtainTrial } = useChosenTrial();

  const placement = new ComputedImageData(imageData);

  const experimentWithPlacement = (newImageData: Partial<IImageStandalone>): { newExp: IExperiment; newData: IImageStandalone; } => {
    const newData = { ...imageData, ...newImageData };
    const newExp = structuredClone(experiment);
    newExp.imageStandalone ||= [];
    newExp.imageStandalone = newExp.imageStandalone.map(x => x.name === imageData.name ? newData : x);
    return { newExp, newData };
  };

  const [measureOne, setMeasureOne] = useState<IAnchorPoint>(() => placement.calcXY({ lat: placement.data.ytop, lng: placement.data.xleft }));
  const [measureTwo, setMeasureTwo] = useState<IAnchorPoint>(() => placement.calcXY({ lat: placement.data.ytop, lng: placement.data.xright }));
  const [zeroPoint, setZeroPoint] = useState<IAnchorPoint>(() => placement.calcXY({ lat: 0, lng: 0 }));

  const anchorToStr = (p: IAnchorPoint): string => {
    return `(${roundDec(p.lng)}, ${roundDec(p.lat)}) in meters<br/>(${roundDec(p.x)}, ${roundDec(p.y)}) in pixels`;
  }

  const changeDistMeters = (newDist: number): void => {
    const dxy = distXY(measureTwo, measureOne);
    if (newDist < 1e-3 || dxy < 1e-3) {
      return;
    }
    const oldDist = distLatLng(measureOne, measureTwo);
    const factorOldToNew = newDist / oldDist;
    const dlng = (measureTwo.lng - measureOne.lng) * factorOldToNew;
    const dlat = (measureTwo.lat - measureOne.lat) * factorOldToNew;
    const lng = measureOne.lng + dlng;
    const lat = measureOne.lat + dlat;

    const dlnglat = distLatLngPythagoras(measureOne, { lng, lat });
    const factorPixelToMeter = dlnglat / dxy;
    const left = round9(measureOne.lng - measureOne.x * factorPixelToMeter);
    const lower = round9(measureOne.lat - measureOne.y * factorPixelToMeter);
    const right = round9(left + placement.data.width * factorPixelToMeter);
    const upper = round9(lower + placement.data.height * factorPixelToMeter);

    setExperiment(experimentWithPlacement({
      ybottom: lower,
      ytop: upper,
      xleft: left,
      xright: right,
    }).newExp);

    setMeasureTwo({ ...measureTwo, lng, lat });
  }

  const changeDistPixels = (newDist: number): void => {
    const dxy = distXY(measureTwo, measureOne);
    if (newDist > 1e-3 && dxy > 1e-3) {
      const factorOldToNew = newDist / dxy;
      const dlng = (measureTwo.lng - measureOne.lng) * factorOldToNew;
      const dlat = (measureTwo.lat - measureOne.lat) * factorOldToNew;
      const lng = measureOne.lng + dlng;
      const lat = measureOne.lat + dlat;
      setMeasureTwo(placement.calcXY({ lng, lat }));
    }
  }

  const changeZeroPoint = (lat: number, lng: number) => {
    const dlat = lat - zeroPoint.lat;
    const dlng = lng - zeroPoint.lng;

    const center = mapObj.getCenter();

    mapObj.setView([center.lat - dlat, center.lng - dlng], undefined, { animate: false });

    const { newExp, newData } = experimentWithPlacement({
      ybottom: placement.data.ybottom - dlat,
      ytop: placement.data.ytop - dlat,
      xleft: placement.data.xleft - dlng,
      xright: placement.data.xright - dlng,
    });

    const compData = new ComputedImageData(newData);
    setMeasureOne(compData.calcLatLng(measureOne));
    setMeasureTwo(compData.calcLatLng(measureTwo));
    setZeroPoint(compData.calcXY(zeroPoint));

    if (isTrialChosen()) {
      for (const d of obtainTrial(newExp)?.trial?.devicesOnTrial || []) {
        const coordinates = d?.location?.coordinates;
        if (coordinates && d?.location?.name === imageData.name) {
          coordinates[0] = compData.calcLat(placement.calcY(coordinates[0]));
          coordinates[1] = compData.calcLng(placement.calcX(coordinates[1]));
        }
      }
    }

    setExperiment(newExp);
  }

  return (
    <>
      <ChosenMarker center={[measureOne.lat, measureOne.lng]}>
        <MarkedPoint
          location={[measureOne.lat, measureOne.lng]}
          setLocation={([lat, lng]) => setMeasureOne(placement.calcXY({ lat, lng }))}
          locationToShow={"Measure anchor 0:<br/>" + anchorToStr(measureOne)}
        />
      </ChosenMarker>
      <ChosenMarker center={[measureTwo.lat, measureTwo.lng]} color="green">
        <MarkedPoint
          location={[measureTwo.lat, measureTwo.lng]}
          setLocation={([lat, lng]) => setMeasureTwo(placement.calcXY({ lat, lng }))}
          locationToShow={"Measure anchor 1:<br/>" + anchorToStr(measureTwo)}
        />
      </ChosenMarker>
      <DashedPolyline
        positions={[
          measureOne,
          measureTwo
        ]}
      >
        <Tooltip
          position={{ lat: (measureOne.lat + measureTwo.lat) / 2, lng: (measureOne.lng + measureTwo.lng) / 2 }}
          permanent={true}
          direction="top"
          interactive={true}
        >
          <Stack>
            <TextFieldDebounceOutlined
              InputProps={{ style: { height: '30px', width: '120px' } }}
              label="Span in meters"
              value={roundDec(distLatLng(measureOne, measureTwo))}
              onChange={(newDist) => changeDistMeters(newDist)}
            />
            <TextFieldDebounceOutlined
              InputProps={{ style: { height: '30px', width: '120px' } }}
              label="Span in Pixels"
              value={roundDec(distXY(measureOne, measureTwo))}
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
              setLatLng={({ lat, lng }) => setZeroPoint(placement.calcXY({ lat, lng }))}
            />
          </Popup>
        </MarkedPoint>
      </ChosenMarker>
    </>
  )
}
