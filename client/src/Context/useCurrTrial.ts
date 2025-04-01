import { useContext } from "react";
import { useExperimentProvider } from "./ExperimentProvider";
import { TrialObject } from "./TrialObject";

export const useCurrTrial = ({ }) => {
    const { currTrial, setTrialData } = useExperimentProvider();

    const trial = new TrialObject(() => currTrial?.trial, setTrialData);

    return {
        trial,
    }
}