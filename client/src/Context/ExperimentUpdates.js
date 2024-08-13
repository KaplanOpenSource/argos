import dayjs from 'dayjs';
import { createNewName } from "../Utils/utils";
import { argosJsonVersion } from '../constants/constants';
import * as jsonpatch from 'fast-json-patch';
import { assignUuids, cleanUuids } from './TrackUuidUtils';
import { change } from './ExperimentProvider';

export class ExperimentUpdates {
    constructor(state, setState) {
        this.state = state;
        this.setState = setState;
    }

    static initialState = {
        experiments: [],
        undoStack: [],
        redoStack: [],
        serverUpdates: [],
    }

    deleteExperiment = (name) => {
        this.setState(change(this.state, draft => { 
            draft.experiments = draft.experiments.filter(t => t.name !== name);
            draft.serverUpdates.push({ name, exp: undefined });
        }));
    }

    addExperiment = (newExp = undefined) => {
        const name = createNewName(this.state.experiments, newExp ? newExp.name : 'New Experiment');
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
        this.setState(change(this.state, draft => { 
            draft.experiments.push(exp);
            draft.serverUpdates.push({ name, exp });
        }));
    }

    setExperiment = (name, data) => {
        const i = this.state.experiments.findIndex(t => t.name === name)
        if (i === -1) {
            alert("Unknown experiment name " + name);// + "\n" + this.state.experiments.map(e => e.name).join(', '));
            return;
        }
        if (data.name !== data.name.trim()) {
            alert("Invalid experiment name, has trailing or leading spaces " + data.name);
            return;
        }
        if (this.state.experiments.find((e, ei) => e.name === data.name && ei !== i)) {
            alert("Duplicate experiment name " + data.name);// + "\n" + this.state.experiments.map(e => e.name).join(', '));
            return;
        }
        const exp = this.state.experiments[i];
        const redoPatch = jsonpatch.compare(exp, data);
        const undoPatch = jsonpatch.compare(data, exp);
        if (redoPatch.length === 0) {
            return; // nothing was changed
        }
        this.setState(change(this.state, draft => { 
            draft.experiments[i] = data;
            draft.undoStack.push({ name, undoPatch, redoPatch });
            draft.redoStack = [];
            draft.serverUpdates.push({ name, exp: data });
        }));
    }


    undoOperation = () => {
        this.setState(change(this.state, draft => { 
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

    redoOperation = () => {
        this.setState(change(this.state, draft => { 
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
}