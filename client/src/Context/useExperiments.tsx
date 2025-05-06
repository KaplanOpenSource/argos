import dayjs from "dayjs";
import { create } from "zustand";
import { argosJsonVersion } from "../constants/constants";
import { IExperiment } from "../types/types";
import { createNewName } from "../Utils/utils";
import { assignUuids, cleanUuids } from "./TrackUuidUtils";
import { useServerUpdates } from "./useServerUpdates";

interface ExperimentsStore {
  experiments: IExperiment[],
  getExperiment: (experimentName: string) => IExperiment | undefined,
  setAllExperiments: (applyer: (prev: IExperiment[]) => IExperiment[]) => void,
  deleteExperiment: (name: string) => void,
  addExperiment: (newExp?: IExperiment | undefined) => void,
  setExperiment: (name: string, exp: IExperiment) => void,
}

export const useExperiments = create<ExperimentsStore>()((set, get) => ({
  experiments: [],

  getExperiment: (experimentName: string) => {
    return get().experiments?.find(t => t.name === experimentName);
  },

  setAllExperiments: (applyer: (prev: IExperiment[]) => IExperiment[]) => {
    set(prev => {
      return { experiments: applyer(prev.experiments) }
    });
  },

  deleteExperiment: (name: string) => {
    set(prev => {
      const experiments = prev.experiments.filter(t => t.name !== name);
      return { ...prev, experiments };
    });

    useServerUpdates.getState().sendUpdate(name, undefined);
  },

  addExperiment: (newExp: IExperiment | undefined = undefined) => {
    newExp ||= {
      version: argosJsonVersion,
      startDate: dayjs().startOf('day').toISOString(),
      endDate: dayjs().startOf('day').add(7, 'day').toISOString(),
      description: '',
    };

    const name = createNewName(get().experiments, newExp?.name ?? 'New Experiment');
    const exp: IExperiment = assignUuids(cleanUuids({ ...newExp, name }));

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
