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
    isTrialChosen: () => boolean,
    isExperimentChosen: () => boolean,
    obtainTrial: (experiment: IExperiment | undefined) => { trialType: ITrialType | undefined, trial: ITrial | undefined },
    setTrialIntoExp: (newTrialData: ITrial, experiment: IExperiment | undefined) => boolean,
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
            return get().obtainTrial(get().experiment()).trialType;
        },
        trial: () => {
            return get().obtainTrial(get().experiment()).trial;
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
    })
})
