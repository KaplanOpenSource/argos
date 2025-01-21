import { useContext } from "react";
import { experimentContext } from "./ExperimentProvider";
import { ActionsOnMapContext } from "../Map/ActionsOnMapContext";
import type { LatLngTuple, Map as LeafletMap } from 'leaflet';
import { IExperiment, IImageStandalone } from "../types/types";
import { CoordsSpan } from "../Experiment/CoordsSpan";

export const useShownMap = ({ }) => {
    const { setShownMap, currTrial } = useContext(experimentContext);
    const { addActionOnMap } = useContext(ActionsOnMapContext);
    const experiment: IExperiment | undefined = currTrial?.experiment;

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
        if (experiment) {
            const s = experiment.imageStandalone?.find(s => s.name === mapName);
            if (s) {
                setShownMap(s.name);
                setTimeout(() => {
                    fitBoundsToImage(s);
                }, 200);
            } else {
                setShownMap(undefined);
                setTimeout(() => {
                    fitBoundsToExperiment(experiment);
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