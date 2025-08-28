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

export const useExperimentProvider = () => {
  const { experiment, trialType, trial } = useChosenTrial.getState();
  return {
    currTrial: {
      experiment: experiment,
      trialType: trialType,
      trial: trial,
    },
  };
}