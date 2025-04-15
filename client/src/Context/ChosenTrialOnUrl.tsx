import { useEffect, useState } from "react";
import { parseUrlParams, replaceUrlParams } from "../Utils/utils";
import { useChosenTrial } from "./useChosenTrial";
import { useExperiments } from "./useExperiments";

export const ChosenTrialOnUrl = ({ }) => {
    const { experiment, trialType, trial, shownMap, chooseTrial, chooseShownMap } = useChosenTrial();
    const { experiments } = useExperiments();
    const [parsedOnce, setParsedOnce] = useState(false);
    // const mapObj = useMapEvents({
    //     move: () => {
    //         replaceUrlParams({
    //             lat: mapObj.getCenter().lat,
    //             lng: mapObj.getCenter().lng,
    //             z: mapObj.getZoom(),
    //         });
    //     },
    // });

    useEffect(() => {
        if (!parsedOnce && experiments.length > 0) {
            const { experimentName, trialTypeName, trialName, shownMapName } = parseUrlParams();
            if (experimentName) {
                chooseTrial({ experimentName, trialTypeName, trialName });
            }
            setParsedOnce(true);
        }
    }, [parsedOnce, experiments.length]);

    useEffect(() => {
        if (parsedOnce) {
            replaceUrlParams({
                experimentName: experiment?.name,
                trialTypeName: trialType?.name,
                trialName: trial?.name,
                shownMapName: shownMap?.name,
            });
        }
    }, [parsedOnce, experiment?.name, trialType?.name, trial?.name, shownMap?.name])
    return null
}