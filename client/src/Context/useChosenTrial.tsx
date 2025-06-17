import { useEffect } from "react";
import { create } from "zustand";
import { ExperimentObj, TrialObj, TrialTypeObj } from "../objects";
import { IExperiment, IImageStandalone, ITrial, ITrialType } from "../types/types";
import { useExperiments } from "./useExperiments";

type IChosenNames = {
  experiment?: { name: string; index: number; } | undefined;
  trialType?: { name: string; index: number; } | undefined;
  trial?: { name: string; index: number; } | undefined;
  shownMap?: { name: string; index: number; } | undefined;
};

interface ChosenTrialStore {
  experiment: ExperimentObj | undefined,
  trialType: TrialTypeObj | undefined,
  trial: TrialObj | undefined,
  shownMap: IImageStandalone | undefined,
  chosenNames: IChosenNames,
  chooseTrial: (params: {
    experimentName?: string | undefined,
    trialTypeName?: string | undefined,
    trialName?: string | undefined,
  }) => void,
  chooseShownMap: (shownMapName: string | undefined) => void,
  isTrialChosen: () => boolean,
  isExperimentChosen: () => boolean,
  obtainTrial: (experiment: IExperiment | undefined) => { trialType: ITrialType | undefined, trial: ITrial | undefined },
  setTrialIntoExp: (newTrialData: ITrial, experiment: IExperiment | undefined) => boolean,
  changeChosen: (prevData: any, newData: any) => void,
  setTrialData: (newTrialData: ITrial) => void,
}

export const useChosenTrial = create<ChosenTrialStore>()((set, get) => {

  function findNamed<T extends { name?: string }>(
    arr: T[] | undefined,
    name?: string,
  ): {
    found?: { index: number, name: string } | undefined,
    obj?: T | undefined,
  } {
    const index = (arr && name) ? arr.findIndex(a => a.name === name) : -1;
    if (index === -1) return {};
    return { found: { index, name: name! }, obj: arr![index] };
  }

  return ({
    experiment: undefined,
    trialType: undefined,
    trial: undefined,
    shownMap: undefined,
    chosenNames: {},
    chooseTrial: ({
      experimentName,
      trialTypeName,
      trialName,
    }) => {
      const experiment = findNamed(useExperiments.getState().experiments, experimentName);
      const trialType = findNamed(experiment.obj?.trialTypes, trialTypeName);
      const trial = findNamed(trialType.obj?.trials, trialName);
      const chosenNames: IChosenNames = {
        experiment: experiment.found,
        trialType: trial.found ? trialType.found : undefined,
        trial: trial.found,
      };
      set({ chosenNames });
    },
    chooseShownMap: (shownMapName: string | undefined) => {
      set(prev => {
        const found = findNamed(prev.experiment?.imageStandalone, shownMapName);
        return { chosenNames: { ...prev.chosenNames, shownMap: found.found } };
      })
    },
    isTrialChosen: () => get().chosenNames.trial !== undefined, // TODO: check if zustand has computed
    isExperimentChosen: () => get().chosenNames.experiment !== undefined,
    obtainTrial: (experiment: IExperiment | undefined) => {
      const trialType = (experiment?.trialTypes || [])[get().chosenNames.trialType?.index ?? 1e6];
      const trial = (trialType?.trials || [])[get().chosenNames.trial?.index ?? 1e6];
      return { trialType, trial };
    },
    setTrialIntoExp: (newTrialData: ITrial, intoExperiment: IExperiment | undefined) => {
      const tti = get().chosenNames.trialType?.index;
      const tri = get().chosenNames.trial?.index;
      const trialType = (intoExperiment?.trialTypes || [])[tti ?? 1e6];
      const trial = (trialType?.trials || [])[tri ?? 1e6];
      if (!trial) {
        console.log(`trying to set trial data without current trial\n`, newTrialData);
        return false;
      }
      trialType!.trials![tri!] = newTrialData;
      return true;
    },
    changeChosen: (prevData: any, newData: any) => {
      const experiment = get().experiment;
      if (experiment && experiment.name) {
        // The following will clone the experiment and change (recursively and deeply) the prevData to newData
        const changedExperiment = new ExperimentObj(experiment).createChange().change(prevData, newData).apply().toJson(true);
        useExperiments.getState().setExperiment(experiment.name, changedExperiment);
      }
    },
    setTrialData: (newTrialData: ITrial) => {
      const experiment = get().experiment;
      if (experiment?.name && get().trial) {
        const changedExperiment = new ExperimentObj(experiment).toJson(true);
        changedExperiment.trialTypes![get().chosenNames.trialType?.index!].trials![get().chosenNames.trial?.index!] = newTrialData;
        useExperiments.getState().setExperiment(experiment.name, changedExperiment);
      }
    }
  })
})

export const ChosenExperimentUpdater = ({ }) => {
  const { chosenNames } = useChosenTrial();
  const { experiments } = useExperiments();

  useEffect(() => {
    const exp = experiments[chosenNames.experiment?.index ?? 1e6];
    const experiment = exp ? new ExperimentObj(exp) : undefined;
    const trialType = (experiment?.trialTypes || [])[chosenNames.trialType?.index ?? 1e6];
    const trial = (trialType?.trials || [])[chosenNames.trial?.index ?? 1e6];
    const shownMap = (experiment?.imageStandalone || [])[chosenNames.shownMap?.index ?? 1e6];
    useChosenTrial.setState({ experiment, trialType, trial, shownMap });
  }, [experiments, chosenNames]);

  return null;
}