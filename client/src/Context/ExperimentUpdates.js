import dayjs from 'dayjs';
import { createNewName } from "../Utils/utils";
import { argosJsonVersion } from '../constants/constants';
import { assignUuids, cleanUuids } from './TrackUuidUtils';
import { useServerUpdates } from './useServerUpdates';

export const ExperimentUpdatesInitialState = {
    experiments: [],
}

export const useExperimentUpdates = (state, setState) => {
    const { sendUpdate } = useServerUpdates();

    const deleteExperiment = (name) => {
        setState(prev => {
            const experiments = prev.experiments.filter(t => t.name !== name);
            return { ...prev, experiments };
        });

        sendUpdate(name, undefined);
    }

    const addExperiment = (newExp = undefined) => {
        const name = createNewName(state.experiments, newExp ? newExp.name : 'New Experiment');
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

        setState(prev => {
            const experiments = [...prev.experiments, exp];
            return { ...prev, experiments };
        });

        sendUpdate(name, exp);
    }

    const setExperiment = (name, data) => {
        const i = state.experiments.findIndex(t => t.name === name)
        if (i === -1) {
            alert("Unknown experiment name " + name);// + "\n" + state.experiments.map(e => e.name).join(', '));
            return;
        }
        if (data.name !== data.name.trim()) {
            alert("Invalid experiment name, has trailing or leading spaces " + data.name);
            return;
        }
        if (state.experiments.find((e, ei) => e.name === data.name && ei !== i)) {
            alert("Duplicate experiment name " + data.name);// + "\n" + state.experiments.map(e => e.name).join(', '));
            return;
        }

        setState(prev => {
            const experiments = [...prev.experiments];
            experiments[i] = data;
            return { ...prev, experiments };
        });

        sendUpdate(name, data);
    }

    return {
        deleteExperiment,
        addExperiment,
        setExperiment,
    }
}