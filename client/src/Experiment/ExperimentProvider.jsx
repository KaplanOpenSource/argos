import { createContext, useEffect, useReducer, useState } from "react"
import dayjs from 'dayjs';
import { changeByName, createNewName, parseUrlParams, replaceUrlParams, splitLast } from "../Utils/utils";
import { applyOperation } from 'fast-json-patch';
import * as jsondiffpatch from 'jsondiffpatch';

export const experimentContext = createContext();

// export const useExperiment = useContext(experimentContext);

export const ExperimentProvider = ({ children }) => {
    const actions = {
        SET_ALL_EXPS: 1,
        ADD_EXP: 2,
        DEL_EXP: 3,
        SET_EXP: 4,
        CHANGE_EXP: 5,
        UNDO: 6,
        REDO: 7,
    };
    const initialState = {
        experiments: [],
        undoStack: [],
        redoStack: [],
    }
    const reducer = (state, action) => {
        switch (action.type) {
            case actions.SET_ALL_EXPS:
                return { ...state, experiments: action.payload };
            case actions.ADD_EXP:
                const name = createNewName(state.experiments, 'New Experiment');
                const newExp = {
                    name,
                    startDate: dayjs().startOf('day'),
                    endDate: dayjs().startOf('day').add(7, 'day'),
                    description: '',
                };
                return { ...state, experiments: [...state.experiments, newExp] };
            case actions.DEL_EXP:
                return { ...state, experiments: state.experiments.filter(t => t.name !== action.name) };
            case actions.SET_EXP:
                {
                    const name = action.name;
                    const i = state.experiments.findIndex(t => t.name === name)
                    if (i === -1) {
                        return state;
                    }
                    const experiments = state.experiments.slice();
                    const delta = jsondiffpatch.diff(experiments[i], action.data);
                    const undoStack = [...state.undoStack, { name, delta }]
                    experiments[i] = action.data;
                    return { ...state, experiments, undoStack, redoStack: [] };
                }
            case actions.UNDO: {
                const [undoStack, item] = splitLast(state.undoStack);
                if (item) {
                    const { name, delta } = item;
                    const i = state.experiments.findIndex(t => t.name === name)
                    if (i !== -1) {
                        const experiments = state.experiments.slice();
                        experiments[i] = jsondiffpatch.unpatch(experiments[i], delta);
                        const redoStack = [...state.redoStack, item];
                        return { ...state, experiments, undoStack, redoStack };
                    }
                }
                return state;
            }
            case actions.REDO: {
                const [redoStack, item] = splitLast(state.redoStack);
                if (item) {
                    const { name, delta } = item;
                    const i = state.experiments.findIndex(t => t.name === name)
                    if (i !== -1) {
                        const experiments = state.experiments.slice();
                        experiments[i] = jsondiffpatch.patch(experiments[i], delta);
                        const undoStack = [...state.undoStack, item];
                        return { ...state, experiments, undoStack, redoStack };
                    }
                }
                return state;
            }
            default:
                return state;
        }
    };
    const [state, dispatch] = useReducer(reducer, initialState);
    const experiments = state.experiments;

    const [currTrialInternal, setCurrTrialInternal] = useState();
    const [showExperiments, setShowExperiments] = useState(true);
    const [selection, setSelection] = useState([]);

    const baseUrl = window.location.port === '8080' ? '' : 'http://127.0.0.1:8080';

    const getExperimentList = async () => {
        const resp = await fetch(baseUrl + "/experiment_list");
        const json = await resp.json();
        if ((json || {}).error) {
            alert(json.error);
            return;
        }

        // TODO: reading all the experiments data just to get the dates and so
        // this can be optimized by fetching limited data from the server
        const exp = [];
        const errors = [];
        for (const name of (json || [])) {
            const resp = await fetch(baseUrl + "/experiment/" + name);
            const json = await resp.json();
            if ((json || {}).error) {
                errors.push(json.error);
                continue;
            }
            if ((json || {}).name !== name) {
                errors.push(`corrupted experiment ${name}`);
                continue;
            }
            exp.push(json);
        }
        if (errors.length) {
            alert(errors.join('\n'));
            return;
        }

        dispatch({ type: actions.SET_ALL_EXPS, payload: exp });
        const { experimentName, trialTypeName, trialName } = parseUrlParams();
        setCurrTrial({ experimentName, trialTypeName, trialName }, exp);
    }

    const deleteExperiment = (name) => {
        dispatch({ type: actions.DEL_EXP, name: name });
    }

    const addExperiment = async () => {
        dispatch({ type: actions.ADD_EXP });
    }

    const setExperiment = (name, data) => {
        dispatch({ type: actions.SET_EXP, name, data });
    }

    const saveExperiment = async (name) => {
        const data = experiments.find(t => t.name === name);
        try {
            const resp = await fetch(baseUrl + "/experiment_set/" + name, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });
            const json = await resp.json();
            if ((json || {}).error) {
                alert(json.error);
                return false;
            }
        } catch (e) {
            alert(e);
            return false;
        }
        return true;
    }

    const currTrial = currTrialInternal
        ? {
            experiment: experiments[currTrialInternal.experimentIndex],
            experimentName: currTrialInternal.experimentName,
            trialType: experiments[currTrialInternal.experimentIndex].trialTypes[currTrialInternal.trialTypeIndex],
            trialTypeName: currTrialInternal.trialTypeName,
            trial: experiments[currTrialInternal.experimentIndex].trialTypes[currTrialInternal.trialTypeIndex].trials[currTrialInternal.trialIndex],
            trialName: currTrialInternal.trialName,
        }
        : {};

    const setCurrTrial = (newCurrTrialStruct, theExperiments = undefined) => {
        theExperiments = theExperiments || experiments;
        if (newCurrTrialStruct) {
            const { experimentName, trialTypeName, trialName } = newCurrTrialStruct;
            const experimentIndex = theExperiments.findIndex(t => t.name === experimentName);
            if (experimentIndex >= 0) {
                const experiment = theExperiments[experimentIndex];
                const trialTypeIndex = experiment.trialTypes.findIndex(t => t.name === trialTypeName);
                if (trialTypeIndex >= 0) {
                    const trialType = experiment.trialTypes[trialTypeIndex];
                    const trialIndex = trialType.trials.findIndex(t => t.name === trialName);
                    if (trialIndex >= 0) {
                        const trial = trialType.trials[trialIndex];
                        setCurrTrialInternal({
                            experimentName, experimentIndex,
                            trialTypeName, trialTypeIndex,
                            trialName, trialIndex,
                        });
                        replaceUrlParams({
                            experimentName,
                            trialTypeName,
                            trialName,
                        });
                        return;
                    }
                }
            }
        }
        setCurrTrialInternal();
        replaceUrlParams({
            experimentName: undefined,
            trialTypeName: undefined,
            trialName: undefined,
        });
    }

    const trialData = currTrialInternal
        ? experiments[currTrialInternal.experimentIndex]
            .trialTypes[currTrialInternal.trialTypeIndex]
            .trials[currTrialInternal.trialIndex]
        : undefined;

    const setTrialData = async (data) => {
        if (!currTrialInternal) {
            console.log(`trying to set trial data without current trial\n`, data);
            return;
        }
        const e = JSON.parse(JSON.stringify(experiments[currTrialInternal.experimentIndex]));
        e.trialTypes[currTrialInternal.trialTypeIndex].trials[currTrialInternal.trialIndex] = data;
        setExperiment(currTrialInternal.experimentName, e)
    }

    useEffect(() => {
        getExperimentList();
    }, [])

    const store = {
        experiments,
        deleteExperiment,
        addExperiment,
        setExperiment,
        saveExperiment,
        setCurrTrial,
        currTrial,
        trialData,
        setTrialData,
        showExperiments,
        setShowExperiments,
        selection,
        setSelection,
        undoOperation: () => dispatch({ type: actions.UNDO }),
        redoOperation: () => dispatch({ type: actions.REDO }),
    };

    return (
        <experimentContext.Provider value={store}>
            {children}
        </experimentContext.Provider>
    )
}