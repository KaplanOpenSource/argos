import { createContext, useContext } from "react";
import { IExperiment, IImageStandalone, ITrial, ITrialType } from "../types/types";
import { useChosenTrial } from "./useChosenTrial";

// TODO:
// - When changing name or deleting trial before current trial, different trial is chosen
// - change setLocation to Obj
// - Select options on attribute should not be name but be reference to attribute option
// - Trial object batch should be replaced with changing the trial or experiment using changeChosen
// - state on useExperiment should be of ExperimentObj not IExperiment
// - deletes from lists should be done on ExperimentObj
// - remove currTrial, use different stores as needed
// - avoid using actions from ExperimentProvider

interface IExperimentProviderStore {
  currTrial: {
    experiment: IExperiment | undefined;
    trialType: ITrialType | undefined; // the current trial type
    trial: ITrial | undefined; // the current trial
    shownMap: IImageStandalone | undefined; // the current shown map
    shownMapName: string | undefined; // the name of the current shown map
  }; // the current trial information
};

const experimentContext = createContext<IExperimentProviderStore | null>(null);

export const ExperimentProvider = ({
  children
}: {
  children: any
}) => {
  const {
    experiment,
    trialType,
    trial,
    shownMap,
  } = useChosenTrial();

  const currTrial = {
    experiment: experiment,
    trialType: trialType,
    trial: trial,
    shownMap: shownMap,
    shownMapName: shownMap?.name,
  };

  const store = {
    currTrial,
  };

  return (
    <experimentContext.Provider value={store}>
      {children}
    </experimentContext.Provider>
  )
}

// useExperimentProvider should be at the end to avoid reload problems
export const useExperimentProvider = () => useContext(experimentContext)!;
