import { createContext, useEffect, useReducer, useState } from "react"
import dayjs from 'dayjs';
import { createNewName, parseUrlParams, replaceUrlParams, splitLast } from "../Utils/utils";
import * as jsonpatch from 'fast-json-patch';
import { fetchAllExperiments, saveExperimentWithData } from "./FetchExperiment";
import { RealMapName, argosJsonVersion } from "../constants/constants";

export const experimentContext = createContext();

const actions = {
    SET_ALL_EXPS: "SET_ALL_EXPS",
    ADD_EXP: "ADD_EXP",
    DEL_EXP: "DEL_EXP",
    SET_EXP: "SET_EXP",
    CHANGE_EXP: "CHANGE_EXP",
    UNDO: "UNDO",
    REDO: "REDO",
    CLEAR_SERVER_UPDATES: "CLEAR_SERVER_UPDATES",
    SET_CURR_TRIAL: "SET_CURR_TRIAL",
    SET_SHOWN_MAP: "SET_SHOWN_MAP",
};

const initialState = {
    experiments: [],
    undoStack: [],
    redoStack: [],
    serverUpdates: [],
    currTrial: {},
}

const reducer = (state, action) => {
    switch (action.type) {
        case actions.SET_ALL_EXPS: {
            return { ...state, experiments: action.payload || [] };
        }
        case actions.ADD_EXP: {
            const name = createNewName(state.experiments, action.data ? action.data.name : 'New Experiment');
            const newExp = action.data ? action.data : {
                version: argosJsonVersion,
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
            if (data.name !== data.name.trim()) {
                alert("Invalid experiment name, has trailing or leading spaces");
                return state;
            }
            if (state.experiments.find((e, ei) => e.name === data.name && ei !== i)) {
                alert("Duplicate experiment name");
                return state;
            }
            const redoPatch = jsonpatch.compare(state.experiments[i], data);
            if (redoPatch.length === 0) {
                return state;
            }
            const experiments = state.experiments.slice();
            const undoPatch = jsonpatch.compare(data, experiments[i]);
            const undoStack = [...state.undoStack, { name, undoPatch, redoPatch }]
            const serverUpdates = [...state.serverUpdates, { name, exp: data }];
            experiments[i] = data;
            return {
                ...state,
                experiments,
                undoStack,
                redoStack: [],
                serverUpdates,
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
        case actions.SET_CURR_TRIAL: {
            const { experimentName, trialTypeName, trialName } = action;
            const experimentIndex = state.experiments.findIndex(t => t.name === experimentName);
            if (experimentIndex >= 0) {
                const experiment = state.experiments[experimentIndex];
                const trialTypeIndex = experiment.trialTypes.findIndex(t => t.name === trialTypeName);
                if (trialTypeIndex >= 0) {
                    const trialType = experiment.trialTypes[trialTypeIndex];
                    const trialIndex = trialType.trials.findIndex(t => t.name === trialName);
                    if (trialIndex >= 0) {
                        replaceUrlParams({
                            experimentName,
                            trialTypeName,
                            trialName,
                        });
                        return {
                            ...state,
                            currTrial: {
                                experimentName, experimentIndex,
                                trialTypeName, trialTypeIndex,
                                trialName, trialIndex,
                            }
                        }
                    }
                }
            }
            replaceUrlParams({
                experimentName: undefined,
                trialTypeName: undefined,
                trialName: undefined,
            });
            return { ...state, currTrial: {} };
        }
        case actions.SET_SHOWN_MAP: {
            if (state.currTrial.experimentName) {
                const experiment = state.experiments[state.currTrial.experimentIndex];
                const { shownMapName } = action;
                const shownMapIndex = experiment.imageStandalone.findIndex(t => t.name === shownMapName);
                if (shownMapIndex >= 0) {
                    replaceUrlParams({ shownMapName });
                    return { ...state, currTrial: { ...state.currTrial, shownMapName, shownMapIndex } };
                }
            }
            replaceUrlParams({ shownMapName: undefined });
            return { ...state, currTrial: { ...state.currTrial, shownMapName: undefined, shownMapIndex: undefined } };
        }
        default: {
            return state;
        }
    }
};

export const ExperimentProvider = ({ children }) => {
    const [state, dispatch] = useReducer(reducer, initialState);
    const experiments = state.experiments;

    const [selection, setSelection] = useState([]);
    const [showImagePlacement, setShowImagePlacement] = useState(false);

    const currTrialByIndices = () => {
        if (state.currTrial.trialName) {
            const experiment = state.experiments[state.currTrial.experimentIndex];
            const trialType = experiment.trialTypes[state.currTrial.trialTypeIndex];
            const trial = trialType.trials[state.currTrial.trialIndex];
            return {
                ...state.currTrial,
                experiment,
                trialType,
                trial,
            }
        }
        return {};
    }

    const currTrial = currTrialByIndices();

    const setCurrTrial = (newCurrTrialStruct) => {
        const { experimentName, trialTypeName, trialName } = newCurrTrialStruct || {};
        dispatch({ type: actions.SET_CURR_TRIAL, experimentName, trialTypeName, trialName });
    }

    const deleteExperiment = (name) => {
        dispatch({ type: actions.DEL_EXP, name: name });
    }

    const addExperiment = (newExp = undefined) => {
        dispatch({ type: actions.ADD_EXP, data: newExp });
    }

    const setExperiment = (name, data) => {
        dispatch({ type: actions.SET_EXP, name, data });
    }

    const setTrialData = (data) => {
        if (state.currTrial.trialName === undefined) {
            console.log(`trying to set trial data without current trial\n`, data);
            return;
        }
        const e = jsonpatch.deepClone(currTrial.experiment);
        e.trialTypes[currTrial.trialTypeIndex].trials[currTrial.trialIndex] = data;
        setExperiment(currTrial.experimentName, e)
    }

    const setLocationsToDevices = (deviceTypeItems, latlngs) => {
        const { trial } = currTrial;
        const mapName = currTrial.shownMapName || RealMapName;
        let count = 0;
        if (trial && deviceTypeItems.length > 0 && latlngs.length > 0) {
            let devicesOnTrial = [...(trial.devicesOnTrial || [])];
            for (let i = 0; i < deviceTypeItems.length; ++i) {
                if (i < latlngs.length) {
                    const { deviceTypeName, deviceItemName } = deviceTypeItems[i];
                    devicesOnTrial = devicesOnTrial.filter(t => {
                        return t.deviceItemName !== deviceItemName || t.deviceTypeName !== deviceTypeName;
                    });
                    const coordinates = latlngs[i];
                    if (coordinates) {
                        const location = { name: mapName, coordinates };
                        devicesOnTrial.push({ deviceTypeName, deviceItemName, location });
                    }
                    count++;
                }
            }
            const data = { ...trial, devicesOnTrial };
            setTrialData(data);
        }
        return count;
    }

    const setLocationsToStackDevices = (latlngs) => {
        const count = setLocationsToDevices(selection, latlngs);
        if (count > 0) {
            setSelection(selection.slice(count));
        }
    }

    const deleteDevice = ({ experimentName, deviceItemName, deviceTypeName }) => {
        const e = jsonpatch.deepClone(state.experiments.find(e => e.name === experimentName));
        if (!e) {
            console.log(`unknown experiment ${experimentName}`);
            return;
        }
        const dt = (e.deviceTypes || []).find(t => t.name === deviceTypeName);
        if (dt && dt.devices) {
            dt.devices = dt.devices.filter(d => d.name !== deviceItemName);
        }
        for (const tt of e.trialTypes) {
            for (const tr of (tt.trials || [])) {
                if (tr && tr.devicesOnTrial) {
                    tr.devicesOnTrial = tr.devicesOnTrial.filter(d => !(d.deviceTypeName === deviceTypeName && d.deviceItemName === deviceItemName));
                }
            }
        }
        setExperiment(currTrial.experimentName, e)
    }

    const deleteDeviceType = ({ experimentName, deviceTypeName }) => {
        const e = jsonpatch.deepClone(state.experiments.find(e => e.name === experimentName));
        if (!e) {
            console.log(`unknown experiment ${experimentName}`);
            return;
        }
        e.deviceTypes = (e.deviceTypes || []).filter(t => t.name !== deviceTypeName);
        for (const tt of e.trialTypes) {
            for (const tr of (tt.trials || [])) {
                if (tr && tr.devicesOnTrial) {
                    tr.devicesOnTrial = tr.devicesOnTrial.filter(d => d.deviceTypeName !== deviceTypeName);
                }
            }
        }
        setExperiment(currTrial.experimentName, e)
    }

    useEffect(() => {
        (async () => {
            const exp = await fetchAllExperiments();
            dispatch({ type: actions.SET_ALL_EXPS, payload: exp || [] });
            const { experimentName, trialTypeName, trialName } = parseUrlParams();
            setCurrTrial({ experimentName, trialTypeName, trialName });
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
    }, [state.serverUpdates]);

    const store = {
        experiments,
        deleteExperiment,
        addExperiment,
        setExperiment,
        setCurrTrial,
        currTrial,
        setTrialData,
        deleteDevice,
        deleteDeviceType,
        selection,
        setSelection,
        undoOperation: () => dispatch({ type: actions.UNDO }),
        redoOperation: () => dispatch({ type: actions.REDO }),
        setLocationsToDevices,
        setLocationsToStackDevices,
        setShownMap: (shownMapName) => dispatch({ type: actions.SET_SHOWN_MAP, shownMapName }),
        showImagePlacement,
        setShowImagePlacement,
    };

    return (
        <experimentContext.Provider value={store}>
            {children}
        </experimentContext.Provider>
    )
}