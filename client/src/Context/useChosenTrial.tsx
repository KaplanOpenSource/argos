import { create } from "zustand";
import { IExperiment, IImageStandalone, ITrial, ITrialType } from "../types/types";
import { useExperiments } from "./useExperiments";

interface ChosenTrialStore {
    experiment: IExperiment | undefined,
    trialType: ITrialType | undefined,
    trial: ITrial | undefined,
    shownMap: IImageStandalone | undefined,
    chooseTrial: (params: {
        experimentName: string | undefined,
        trialTypeName: string | undefined,
        trialName: string | undefined,
    }) => void,
    chooseShownMap: (shownMapName: string | undefined) => void,
}

export const useChosenTrial = create<ChosenTrialStore>()((set, get) => ({
    experiment: undefined,
    trialType: undefined,
    trial: undefined,
    shownMap: undefined,
    chooseTrial: ({
        experimentName,
        trialTypeName,
        trialName,
    }) => {
        set(() => {
            const { experiments } = useExperiments.getState();
            const experiment = experiments.find(t => t.name === experimentName);
            const trialType = experiment?.trialTypes?.find(t => t.name === trialTypeName);
            const trial = trialType?.trials?.find(t => t.name === trialName);
            return {
                experiment,
                trialType: trial ? trialType : undefined,
                trial,
            };
        })
    },
    chooseShownMap: (shownMapName: string | undefined) => {
        set(prev => {
            const shownMap = prev.experiment?.imageStandalone?.find(t => t.name === shownMapName);
            return { shownMap };
        })
    },
}))
