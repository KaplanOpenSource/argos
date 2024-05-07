import dayjs from 'dayjs';
import { createNewName } from "../Utils/utils";
import { argosJsonVersion } from '../constants/constants';
import * as jsonpatch from 'fast-json-patch';

export class ExperimentUpdates {
    static deleteExperiment = (state, setState, name) => {
        setState(draft => {
            draft.experiments = draft.experiments.filter(t => t.name !== name);
            draft.serverUpdates.push({ name, exp: undefined });
        })
    }

    static addExperiment = (state, setState, newExp = undefined) => {
        setState(draft => {
            const name = createNewName(draft.experiments, newExp ? newExp.name : 'New Experiment');
            const exp = newExp ? newExp : {
                version: argosJsonVersion,
                name,
                startDate: dayjs().startOf('day'),
                endDate: dayjs().startOf('day').add(7, 'day'),
                description: '',
            };
            draft.experiments.push(exp);
            draft.serverUpdates.push({ name, exp });
        });
    }

    static setExperiment = (state, setState, name, data) => {
        const i = state.experiments.findIndex(t => t.name === name)
        if (i === -1) {
            alert("Unknown experiment name");
            return;
        }
        if (data.name !== data.name.trim()) {
            alert("Invalid experiment name, has trailing or leading spaces");
            return;
        }
        if (state.experiments.find((e, ei) => e.name === data.name && ei !== i)) {
            alert("Duplicate experiment name");
            return;
        }
        const exp = state.experiments[i];
        const redoPatch = jsonpatch.compare(exp, data);
        const undoPatch = jsonpatch.compare(data, exp);
        if (redoPatch.length === 0) {
            return; // nothing was changed
        }
        setState(draft => {
            draft.experiments[i] = data;
            draft.undoStack.push({ name, undoPatch, redoPatch });
            draft.redoStack = [];
            draft.serverUpdates.push({ name, exp: data });
        });
    }


    static undoOperation = (state, setState) => {
        setState(draft => {
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
        });
    }

    static redoOperation = (state, setState) => {
        setState(draft => {
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
        });
    }
}