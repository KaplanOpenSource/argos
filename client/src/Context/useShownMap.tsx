import type { LatLngTuple, Map as LeafletMap } from 'leaflet';
import { useContext } from "react";
import { CoordsSpan } from "../Experiment/CoordsSpan";
import { ActionsOnMapContext } from "../Map/ActionsOnMapContext";
import { IExperiment, IImageStandalone } from "../types/types";
import { useChosenTrial } from "./useChosenTrial";

export const useShownMap = ({ }) => {
  const { addActionOnMap } = useContext(ActionsOnMapContext);
  const { experiment, chooseShownMap } = useChosenTrial();

  const imageHasDimensions = (stand: IImageStandalone) => {
    return (stand.ytop !== undefined &&
      stand.xleft !== undefined &&
      stand.ybottom !== undefined &&
      stand.xright !== undefined);
  }

  const fitBoundsToImage = (stand: IImageStandalone) => {
    if (stand.ytop !== undefined &&
      stand.xleft !== undefined &&
      stand.ybottom !== undefined &&
      stand.xright !== undefined) {
      const bounds: LatLngTuple[] = [[stand.ytop, stand.xleft], [stand.ybottom, stand.xright]];
      addActionOnMap((mapObject: LeafletMap) => {
        mapObject.fitBounds(bounds);
      });
    }
  }

  const fitBoundsToExperiment = (exp: IExperiment) => {
    addActionOnMap((mapObject: LeafletMap) => {
      new CoordsSpan().fromExperiment(exp).fitBounds(mapObject);
    });
  }

  const switchToMap = (mapName: string | undefined) => {
    const exp = experiment();
    if (exp) {
      const s = exp.imageStandalone?.find(s => s.name === mapName);
      if (s) {
        chooseShownMap(s.name);
        setTimeout(() => {
          fitBoundsToImage(s);
        }, 200);
      } else {
        chooseShownMap(undefined);
        setTimeout(() => {
          fitBoundsToExperiment(exp);
        }, 200);
      }
    }
  }

  return {
    imageHasDimensions,
    switchToMap,
    fitBoundsToImage,
    fitBoundsToExperiment,
  }
}