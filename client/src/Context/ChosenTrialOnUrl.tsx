import { useEffect } from "react";
import { parseUrlParams, replaceUrlParams } from "../Utils/utils";
import { useChosenTrial } from "./useChosenTrial";

export const ChosenTrialOnUrl = ({ }) => {
    const { experiment, trialType, trial, shownMap, chooseTrial, chooseShownMap } = useChosenTrial();
    // const mapObj = useMapEvents({
    //     move: () => {
    //         replaceUrlParams({
    //             lat: mapObj.getCenter().lat,
    //             lng: mapObj.getCenter().lng,
    //             z: mapObj.getZoom(),
    //         });
    //     },
    // });

    // useEffect(() => {
    //     const { lat, lng, z } = parseUrlParams();
    //     if (isFinite(lat) && isFinite(lng) && isFinite(z)) {
    //         mapObj.setView([lat, lng], z);
    //     }
    // }, []);

    useEffect(() => {
        replaceUrlParams({
            experimentName: experiment?.name,
            trialTypeName: trialType?.name,
            trialName: trial?.name,
            shownMapName: shownMap?.name,
        });
    }, [experiment?.name, trialType?.name, trial?.name, shownMap?.name])
    return null
}