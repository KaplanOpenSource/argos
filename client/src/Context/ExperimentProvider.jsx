import { createContext, useEffect, useReducer, useState } from "react"
import { useImmer, useImmerReducer } from "use-immer";
import dayjs from 'dayjs';
import { createNewName, parseUrlParams, replaceUrlParams, splitLast } from "../Utils/utils";
import * as jsonpatch from 'fast-json-patch';
import { fetchAllExperiments, saveExperimentWithData } from "./FetchExperiment";
import { RealMapName, argosJsonVersion } from "../constants/constants";

export const experimentContext = createContext();

export const ExperimentProvider = ({ children }) => {
    const [state, setState] = useImmer({
        experiments: [],
        undoStack: [],
        redoStack: [],
        serverUpdates: [],
        currTrial: {},
        selection: [],
        showImagePlacement: false,
    });

    const deleteExperiment = (name) => {
        setState(draft => {
            draft.experiments = draft.experiments.filter(t => t.name !== name);
            draft.serverUpdates.push({ name, exp: undefined });
        })
    }

    const addExperiment = (newExp = undefined) => {
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

    const setExperiment = (name, data) => {
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

    const setCurrTrial = ({ experimentName, trialTypeName, trialName }) => {
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
                    setState(draft => {
                        draft.currTrial = {
                            experimentName, experimentIndex,
                            trialTypeName, trialTypeIndex,
                            trialName, trialIndex,
                        };
                    });
                    return;
                }
            }
        }
        replaceUrlParams({
            experimentName: undefined,
            trialTypeName: undefined,
            trialName: undefined,
        });
        setState(draft => {
            draft.currTrial = {};
        });
    }

    const setShownMap = (shownMapName) => {
        if (state.currTrial.experimentName) {
            const experiment = state.experiments[state.currTrial.experimentIndex];
            const shownMapIndex = experiment.imageStandalone.findIndex(t => t.name === shownMapName);
            if (shownMapIndex >= 0) {
                replaceUrlParams({ shownMapName });
                setState(draft => {
                    draft.currTrial.shownMapName = shownMapName;
                    draft.currTrial.shownMapIndex = shownMapIndex;
                });
            }
        }
        replaceUrlParams({ shownMapName: undefined });
        setState(draft => {
            draft.currTrial.shownMapName = undefined;
            draft.currTrial.shownMapIndex = undefined;
        });
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
        const count = setLocationsToDevices(state.selection, latlngs);
        if (count > 0) {
            setState(draft => { draft.selection = draft.selection.slice(count); });
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

    const undoOperation = () => {
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

    const redoOperation = () => {
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

    useEffect(() => {
        (async () => {
            const allExperiments = await fetchAllExperiments();
            setState(draft => {
                draft.experiments = allExperiments;
            });
            const { experimentName, trialTypeName, trialName } = parseUrlParams();
            setCurrTrial({ experimentName, trialTypeName, trialName });
        })()
    }, [])

    useEffect(() => {
        if (state.serverUpdates.length > 0) {
            (async () => {
                const updates = state.serverUpdates;
                setState(draft => {
                    draft.serverUpdates = [];
                })
                for (const { name, exp } of updates) {
                    await saveExperimentWithData(name, exp);
                }
            })();
        }
    }, [state.serverUpdates]);

    const store = {
        experiments: state.experiments,
        deleteExperiment,
        addExperiment,
        setExperiment,
        setCurrTrial,
        currTrial,
        setTrialData,
        deleteDevice,
        deleteDeviceType,
        selection: state.selection,
        setSelection: val => setState(draft => { draft.selection = val; }),
        undoOperation,
        redoOperation,
        undoPossible: state.undoStack.length > 0,
        redoPossible: state.redoStack.length > 0,
        setLocationsToDevices,
        setLocationsToStackDevices,
        setShownMap,
        showImagePlacement: state.showImagePlacement,
        setShowImagePlacement: val => setState(draft => { draft.showImagePlacement = val; }),
    };

    return (
        <experimentContext.Provider value={store}>
            {children}
        </experimentContext.Provider>
    )
}