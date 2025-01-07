import { useContext } from "react";
import { experimentContext } from "./ExperimentProvider";
import { TrialObject } from "./TrialObject";

export const useCurrTrial = ({ }) => {
    const { currTrial, setTrialData } = useContext(experimentContext);

    const trial = new TrialObject(currTrial?.trial, setTrialData);

    return {
        trial,
    }
}