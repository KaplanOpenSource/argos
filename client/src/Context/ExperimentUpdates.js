import dayjs from 'dayjs';
import { createNewName } from "../Utils/utils";
import { argosJsonVersion } from '../constants/constants';
import * as jsonpatch from 'fast-json-patch';
import { assignUuids, cleanUuids } from './TrackUuidUtils';
import { change } from './ExperimentProvider';
import { useContext, useEffect } from 'react';
import { TokenContext } from '../App/TokenContext';
import { useFetchExperiments } from './FetchExperiment';

export const ExperimentUpdatesInitialState = {
    experiments: [],
    undoStack: [],
    redoStack: [],
    serverUpdates: [],
}

export const useExperimentUpdates = (state, setState) => {
    const { hasToken } = useContext(TokenContext);
    const { saveExperimentWithData } = useFetchExperiments();

    const deleteExperiment = (name) => {
        setState(change(state, draft => {
            draft.experiments = draft.experiments.filter(t => t.name !== name);
            draft.serverUpdates.push({ name, exp: undefined });
        }));
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
        setState(change(state, draft => {
            draft.experiments.push(exp);
            draft.serverUpdates.push({ name, exp });
        }));
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
        const exp = state.experiments[i];
        const redoPatch = jsonpatch.compare(exp, data);
        const undoPatch = jsonpatch.compare(data, exp);
        if (redoPatch.length === 0) {
            return; // nothing was changed
        }
        setState(change(state, draft => {
            draft.experiments[i] = data;
            draft.undoStack.push({ name, undoPatch, redoPatch });
            draft.redoStack = [];
            draft.serverUpdates.push({ name, exp: data });
        }));
    }


    const undoOperation = () => {
        setState(change(state, draft => {
            const item = draft.undoStack.pop();
            if (item) {
                const { name, undoPatch } = item;
                const i = draft.experiments.findIndex(t => t.name === name)
                if (i !== -1) {
                    const exp = jsonpatch.applyPatch(draft.experiments[i], undoPatch, false, false).newDocument;
                    draft.experiments[i] = exp;
                    draft.redoStack.push(item);
                    draft.serverUpdates.push({ name, exp });
                }
            }
        }));
    }

    const redoOperation = () => {
        setState(change(state, draft => {
            const item = draft.redoStack.pop();
            if (item) {
                const { name, redoPatch } = item;
                const i = draft.experiments.findIndex(t => t.name === name)
                if (i !== -1) {
                    const exp = jsonpatch.applyPatch(draft.experiments[i], redoPatch, false, false).newDocument;
                    draft.experiments[i] = exp;
                    draft.undoStack.push(item);
                    draft.serverUpdates.push({ name, exp });
                }
            }
        }));
    }

    useEffect(() => {
        if (hasToken) {
            if (state.serverUpdates.length > 0) {
                (async () => {
                    const updates = state.serverUpdates;
                    setState(change(state, draft => {
                        draft.serverUpdates = [];
                    }));
                    for (const { name, exp } of updates) {
                        await saveExperimentWithData(name, exp);
                    }
                })();
            }
        }
    }, [hasToken, state.serverUpdates]);

    return {
        deleteExperiment,
        addExperiment,
        setExperiment,
        undoOperation,
        redoOperation,
    }
}