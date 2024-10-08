import dayjs from 'dayjs';
import { createNewName } from "../Utils/utils";
import { argosJsonVersion } from '../constants/constants';
import { assignUuids, cleanUuids } from './TrackUuidUtils';
import { change } from './ExperimentProvider';
import { useContext, useEffect } from 'react';
import { TokenContext } from '../App/TokenContext';
import { useFetchExperiments } from './FetchExperiment';
import { jsonApplyItem, jsonCompare } from '../Utils/JsonPatch';

export const ExperimentUpdatesInitialState = {
    experiments: [],
    undoStack: [],
    redoStack: [],
    serverUpdates: [],
}

export const useExperimentUpdates = (state, setState) => {
    const { hasToken } = useContext(TokenContext);
    const { saveExperimentWithData } = useFetchExperiments();

    const sendUpdate = (experimentName, experimentNewData, experimentPrevData) => {
        const redoPatch = jsonCompare(experimentPrevData, experimentNewData);
        // TODO: do inverse patch instead? 
        const undoPatch = jsonCompare(experimentNewData, experimentPrevData);
        if (redoPatch.length === 0) {
            return; // nothing was changed
        }
        // }
        setState(prev => {
            const newUpdate = { name: experimentName, exp: experimentNewData };
            const newUndoItem = { name: experimentName, undoPatch, redoPatch };
            return {
                ...prev,
                serverUpdates: [...prev.serverUpdates, newUpdate],
                undoStack: [...prev.undoStack, newUndoItem],
                redoStack: [],
            };
        });
    }

    const deleteExperiment = (name) => {
        const experimentPrevData = state.experiments.find(t => t.name === name)

        setState(prev => {
            const experiments = prev.experiments.filter(t => t.name !== name);
            return { ...prev, experiments };
        });
        
        sendUpdate(name, undefined, experimentPrevData);
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

        sendUpdate(name, exp, undefined);
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

        const experimentPrevData = state.experiments.find(t => t.name === name)

        setState(prev => {
            const experiments = prev.experiments;
            experiments[i] = data;
            return { ...prev, experiments };
        });

        sendUpdate(name, data, experimentPrevData);
    }


    const undoOperation = () => {
        setState(change(state, draft => {
            const item = draft.undoStack.pop();
            if (item) {
                const { name, undoPatch } = item;
                const i = draft.experiments.findIndex(t => t.name === name)
                const exp = jsonApplyItem(draft.experiments, i, draft.experiments[i], undoPatch);
                draft.redoStack.push(item);
                draft.serverUpdates.push({ name, exp });
            }
        }));
    }

    const redoOperation = () => {
        setState(change(state, draft => {
            const item = draft.redoStack.pop();
            if (item) {
                const { name, redoPatch } = item;
                const i = draft.experiments.findIndex(t => t.name === name)
                const exp = jsonApplyItem(draft.experiments, i, draft.experiments[i], redoPatch);
                draft.undoStack.push(item);
                draft.serverUpdates.push({ name, exp });
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