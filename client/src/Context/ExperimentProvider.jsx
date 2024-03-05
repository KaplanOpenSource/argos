import { createContext, useEffect, useReducer, useState } from "react"
import dayjs from 'dayjs';
import { createNewName, parseUrlParams, replaceUrlParams, splitLast } from "../Utils/utils";
import * as jsonpatch from 'fast-json-patch';
import { fetchAllExperiments, saveExperimentWithData } from "./FetchExperiment";

export const experimentContext = createContext();

// export const useExperiment = useContext(experimentContext);

const actions = {
    SET_ALL_EXPS: "SET_ALL_EXPS",
    ADD_EXP: "ADD_EXP",
    DEL_EXP: "DEL_EXP",
    SET_EXP: "SET_EXP",
    CHANGE_EXP: "CHANGE_EXP",
    UNDO: "UNDO",
    REDO: "REDO",
    CLEAR_SERVER_UPDATES: "CLEAR_SERVER_UPDATES",
};

const initialState = {
    experiments: [],
    undoStack: [],
    redoStack: [],
    serverUpdates: [],
}

const reducer = (state, action) => {
    switch (action.type) {
        case actions.SET_ALL_EXPS: {
            return { ...state, experiments: action.payload };
        }
        case actions.ADD_EXP: {
            const name = createNewName(state.experiments, 'New Experiment');
            const newExp = {
                name,
                startDate: dayjs().startOf('day'),
                endDate: dayjs().startOf('day').add(7, 'day'),
                description: '',
            };
            return {
                ...state,
                experiments: [...state.experiments, newExp],
                serverUpdates: [...state.serverUpdates, { name, exp: newExp }],
            };
        }
        case actions.DEL_EXP: {
            const { name } = action;
            return {
                ...state,
                experiments: state.experiments.filter(t => t.name !== name),
                serverUpdates: [...state.serverUpdates, { name, exp: undefined }],
            };
        }
        case actions.SET_EXP: {
            const { name, data } = action;
            const i = state.experiments.findIndex(t => t.name === name)
            if (i === -1) {
                return state;
            }
            const redoPatch = jsonpatch.compare(state.experiments[i], data);
            if (redoPatch.length === 0) {
                return state;
            }
            const experiments = state.experiments.slice();
            const undoPatch = jsonpatch.compare(data, experiments[i]);
            const undoStack = [...state.undoStack, { name, undoPatch, redoPatch }]
            experiments[i] = data;
            return {
                ...state,
                experiments,
                undoStack,
                redoStack: [],
                serverUpdates: [...state.serverUpdates, { name, exp: data }],
            };
        }
        case actions.UNDO: {
            const [undoStack, item] = splitLast(state.undoStack);
            if (item) {
                const { name, undoPatch } = item;
                const i = state.experiments.findIndex(t => t.name === name)
                if (i !== -1) {
                    const experiments = state.experiments.slice();
                    const newExp = jsonpatch.applyPatch(experiments[i], undoPatch, false, false).newDocument;
                    experiments[i] = newExp;
                    const redoStack = [...state.redoStack, item];
                    return {
                        ...state,
                        experiments,
                        undoStack,
                        redoStack,
                        serverUpdates: [...state.serverUpdates, { name, exp: newExp }],
                    };
                }
            }
            return state;
        }
        case actions.REDO: {
            const [redoStack, item] = splitLast(state.redoStack);
            if (item) {
                const { name, redoPatch } = item;
                const i = state.experiments.findIndex(t => t.name === name)
                if (i !== -1) {
                    const experiments = state.experiments.slice();
                    const newExp = jsonpatch.applyPatch(experiments[i], redoPatch, false, false).newDocument;
                    experiments[i] = newExp;
                    const undoStack = [...state.undoStack, item];
                    return {
                        ...state,
                        experiments,
                        undoStack,
                        redoStack,
                        serverUpdates: [...state.serverUpdates, { name, exp: newExp }],
                    };
                }
            }
            return state;
        }
        case actions.CLEAR_SERVER_UPDATES: {
            return { ...state, serverUpdates: [] };
        }
        default: {
            return state;
        }
    }
};

export const ExperimentProvider = ({ children }) => {
    const [state, dispatch] = useReducer(reducer, initialState);
    const experiments = state.experiments;

    const [currTrialInternal, setCurrTrialInternal] = useState();
    const [showExperiments, setShowExperiments] = useState(true);
    const [selection, setSelection] = useState([]);

    const deleteExperiment = (name) => {
        dispatch({ type: actions.DEL_EXP, name: name });
    }

    const addExperiment = async () => {
        dispatch({ type: actions.ADD_EXP });
    }

    const setExperiment = (name, data) => {
        dispatch({ type: actions.SET_EXP, name, data });
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

    const setTrialData = (data) => {
        if (!currTrialInternal || currTrialInternal.trialIndex === undefined) {
            console.log(`trying to set trial data without current trial\n`, data);
            return;
        }
        const e = jsonpatch.deepClone(experiments[currTrialInternal.experimentIndex]);
        e.trialTypes[currTrialInternal.trialTypeIndex].trials[currTrialInternal.trialIndex] = data;
        setExperiment(currTrialInternal.experimentName, e)
    }

    useEffect(() => {
        (async () => {
            const exp = await fetchAllExperiments();
            dispatch({ type: actions.SET_ALL_EXPS, payload: exp });
            const { experimentName, trialTypeName, trialName } = parseUrlParams();
            setCurrTrial({ experimentName, trialTypeName, trialName }, exp);
        })()
    }, [])

    useEffect(() => {
        if (state.serverUpdates.length > 0) {
            (async () => {
                const updates = state.serverUpdates;
                dispatch({ type: actions.CLEAR_SERVER_UPDATES });
                for (const { name, exp } of updates) {
                    await saveExperimentWithData(name, exp);
                }
            })();
        }
    }, [state]);

    const store = {
        experiments,
        deleteExperiment,
        addExperiment,
        setExperiment,
        setCurrTrial,
        currTrial,
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