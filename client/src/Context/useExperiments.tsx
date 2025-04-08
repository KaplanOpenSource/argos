import { create } from "zustand";
import { IExperiment } from "../types/types";
import { useServerUpdates } from "./useServerUpdates";
import { createNewName } from "../Utils/utils";
import { assignUuids, cleanUuids } from "./TrackUuidUtils";
import dayjs from "dayjs";
import { argosJsonVersion } from "../constants/constants";

interface ExperimentsStore {
    experiments: IExperiment[],
    setExperiments: (allExps: IExperiment[]) => void,
    deleteExperiment: (name: string) => void,
    addExperiment: (newExp: IExperiment) => void,
    setExperiment: (name: string, data: IExperiment) => void,
}

export const useExperiments = create<ExperimentsStore>()((set, get) => ({
    experiments: [],

    setExperiments: (allExps: IExperiment[]) => {
        set({ experiments: allExps });
    },

    deleteExperiment: (name: string) => {
        const { sendUpdate } = useServerUpdates.getState();
        set(prev => {
            const experiments = prev.experiments.filter(t => t.name !== name);
            return { ...prev, experiments };
        });

        sendUpdate(name, undefined);
    },

    addExperiment: (newExp: IExperiment | undefined = undefined) => {
        const { sendUpdate } = useServerUpdates.getState();
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

        sendUpdate(name, exp);
    },

    setExperiment: (name: string, data: IExperiment) => {
        const { sendUpdate } = useServerUpdates.getState();
        const i = get().experiments.findIndex(t => t.name === name)
        if (i === -1 || !data.name) {
            alert("Unknown experiment name " + name);// + "\n" + state.experiments.map(e => e.name).join(', '));
            return;
        }
        if (data.name !== data.name.trim()) {
            alert("Invalid experiment name, has trailing or leading spaces " + data.name);
            return;
        }
        if (get().experiments.find((e, ei) => e.name === data.name && ei !== i)) {
            alert("Duplicate experiment name " + data.name);// + "\n" + state.experiments.map(e => e.name).join(', '));
            return;
        }

        set(prev => {
            const experiments = [...prev.experiments];
            experiments[i] = data;
            return { ...prev, experiments };
        });

        sendUpdate(name, data);
    },
}))
