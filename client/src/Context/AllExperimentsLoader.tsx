import { useEffect } from "react";
import { useUndoRedo } from "../App/UndoRedo/useUndoRedo";
import { parseUrlParams } from "../Utils/utils";
import { assignUuids } from "./TrackUuidUtils";
import { useFetchExperiments } from "./FetchExperiment";
import { useTokenStore } from "./useTokenStore";
import { useExperiments } from "./useExperiments";

export const AllExperimentsLoader = ({ }) => {
    const { isLoggedIn } = useTokenStore();
    const { setAllExperiments } = useExperiments();
    const { fetchAllExperiments } = useFetchExperiments();

    useEffect(() => {
        (async () => {
            if (isLoggedIn()) {
                const { experimentName, trialTypeName, trialName } = parseUrlParams();

                // $$$$ TODO: 
                // 1. read experiment list, show it from the info
                // 2. read just the chosen experiment
                // 3. switch experiment and read from backend
                // const experimentsNames = await fetchExperimentListInfo();
                const allExperiments = await fetchAllExperiments(); // TODO: move this to a separate component

                // console.log("experimentsNames", experimentsNames)
                // console.log("allExperiments", allExperiments)
                assignUuids(allExperiments);
                setAllExperiments(allExperiments);
                // const t = FindTrialByName({ experimentName, trialTypeName, trialName }, allExperiments);
                // setState(prev => ({
                //     ...prev,
                //     currTrial: t,
                // }));
                setTimeout(() => {
                    useUndoRedo.getState().setTrackChanges(true);
                }, 100);
            }
        })()
    }, [isLoggedIn()])

    return null;
}