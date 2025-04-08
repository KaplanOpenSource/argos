import { create } from "zustand";
import { IExperiment } from "../types/types";
import { useServerUpdates } from "./useServerUpdates";
import { createNewName } from "../Utils/utils";
import { assignUuids, cleanUuids } from "./TrackUuidUtils";
import dayjs from "dayjs";
import { argosJsonVersion } from "../constants/constants";

interface ExperimentsStore {
    experiments: IExperiment[],
    getExperiment: (experimentName: string) => IExperiment | undefined,
    setAllExperiments: (allExps: IExperiment[]) => void,
    deleteExperiment: (name: string) => void,
    addExperiment: (newExp: IExperiment) => void,
    setExperiment: (name: string, exp: IExperiment) => void,
}

export const useExperiments = create<ExperimentsStore>()((set, get) => ({
    experiments: [],

    getExperiment: (experimentName: string) => {
        return get().experiments?.find(t => t.name === experimentName);
    },

    setAllExperiments: (allExps: IExperiment[]) => {
        set({ experiments: allExps });
    },

    deleteExperiment: (name: string) => {
        set(prev => {
            const experiments = prev.experiments.filter(t => t.name !== name);
            return { ...prev, experiments };
        });

        useServerUpdates.getState().sendUpdate(name, undefined);
    },

    addExperiment: (newExp: IExperiment | undefined = undefined) => {
        const name = createNewName(get().experiments, newExp ? newExp.name : 'New Experiment');
        let exp;
        if (newExp) {
            exp = assignUuids(cleanUuids(newExp));
            exp.name = name;
        } else {
            exp = assignUuids({
                version: argosJsonVersion,
                name,
                startDate: dayjs().startOf('day').toISOString(),
                endDate: dayjs().startOf('day').add(7, 'day').toISOString(),
                description: '',
            });
        }

        set(prev => {
            const experiments = [...prev.experiments, exp];
            return { ...prev, experiments };
        });

        useServerUpdates.getState().sendUpdate(name, exp);
    },

    setExperiment: (name: string, exp: IExperiment) => {
        const i = get().experiments.findIndex(t => t.name === name)
        if (i === -1 || !exp.name) {
            alert("Unknown experiment name " + name);// + "\n" + state.experiments.map(e => e.name).join(', '));
            return;
        }
        if (exp.name !== exp.name.trim()) {
            alert("Invalid experiment name, has trailing or leading spaces " + exp.name);
            return;
        }
        if (get().experiments.find((e, ei) => e.name === exp.name && ei !== i)) {
            alert("Duplicate experiment name " + exp.name);// + "\n" + state.experiments.map(e => e.name).join(', '));
            return;
        }

        set(prev => {
            const experiments = [...prev.experiments];
            experiments[i] = exp;
            return { ...prev, experiments };
        });

        useServerUpdates.getState().sendUpdate(name, exp);
    },
}))
