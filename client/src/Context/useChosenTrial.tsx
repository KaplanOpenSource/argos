import { create } from "zustand";
import { IExperiment, IImageStandalone, ITrial, ITrialType } from "../types/types";
import { useExperiments } from "./useExperiments";

type IChosenNames = {
    experiment?: { name: string; index: number; } | undefined;
    trialType?: { name: string; index: number; } | undefined;
    trial?: { name: string; index: number; } | undefined;
};

interface ChosenTrialStore {
    experiment: () => IExperiment | undefined,
    trialType: () => ITrialType | undefined,
    trial: () => ITrial | undefined,
    shownMap: IImageStandalone | undefined,
    chosenNames: IChosenNames,
    chooseTrial: (params: {
        experimentName?: string | undefined,
        trialTypeName?: string | undefined,
        trialName?: string | undefined,
    }) => void,
    chooseShownMap: (shownMapName: string | undefined) => void,
}

export const useChosenTrial = create<ChosenTrialStore>()((set, get) => {

    function find<T extends { name?: string }>(
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
        experiment: () => {
            return useExperiments.getState().experiments[get().chosenNames.experiment?.index ?? 1e6];
        },
        trialType: () => {
            return (get().experiment()?.trialTypes || [])[get().chosenNames.trialType?.index ?? 1e6];
        },
        trial: () => {
            return (get().trialType()?.trials || [])[get().chosenNames.trial?.index ?? 1e6];
        },
        shownMap: undefined,
        chosenNames: {},
        chooseTrial: ({
            experimentName,
            trialTypeName,
            trialName,
        }) => {
            const experiment = find(useExperiments.getState().experiments, experimentName);
            const trialType = find(experiment.obj?.trialTypes, trialTypeName);
            const trial = find(trialType.obj?.trials, trialName);
            const chosenNames: IChosenNames = {
                experiment: experiment.found,
                trialType: trial.found ? trialType.found : undefined,
                trial: trial.found,
            };
            set({ chosenNames });
        },
        chooseShownMap: (shownMapName: string | undefined) => {
            set(prev => {
                const shownMap = prev.experiment()?.imageStandalone?.find(t => t.name === shownMapName);
                return { shownMap };
            })
        },
    })
})
