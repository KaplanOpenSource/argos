import { createContext, useEffect } from "react"
import { useImmer } from "use-immer";
import { parseUrlParams, replaceUrlParams } from "../Utils/utils";
import * as jsonpatch from 'fast-json-patch';
import { fetchAllExperiments, saveExperimentWithData } from "./FetchExperiment";
import { RealMapName } from "../constants/constants";
import { ExperimentUpdates } from "./ExperimentUpdates";
import { TrialChoosing } from "./TrialChoosing";

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

    const deleteExperiment = (...params) => ExperimentUpdates.deleteExperiment(state, setState, ...params);
    const addExperiment = (...params) => ExperimentUpdates.addExperiment(state, setState, ...params);
    const setExperiment = (...params) => ExperimentUpdates.setExperiment(state, setState, ...params);
    const undoOperation = (...params) => ExperimentUpdates.undoOperation(state, setState, ...params);
    const redoOperation = (...params) => ExperimentUpdates.redoOperation(state, setState, ...params);

    const currTrial = TrialChoosing.FindTrialByIndices(state.currTrial, state.experiments);

    const setCurrTrial = ({ experimentName, trialTypeName, trialName }) => {
        const t = TrialChoosing.FindTrialByName({ experimentName, trialTypeName, trialName }, state.experiments);
        TrialChoosing.ReplaceUrlByTrial(t);
        setState(draft => { draft.currTrial = t; });
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

    useEffect(() => {
        (async () => {
            const { experimentName, trialTypeName, trialName } = parseUrlParams();
            const allExperiments = await fetchAllExperiments();
            const t = TrialChoosing.FindTrialByName({ experimentName, trialTypeName, trialName }, allExperiments);
            TrialChoosing.ReplaceUrlByTrial(t);
            setState(draft => {
                draft.experiments = allExperiments;
                draft.currTrial = t;
            });
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
        undoOperation,
        redoOperation,
        undoPossible: state.undoStack.length > 0,
        redoPossible: state.redoStack.length > 0,
        setCurrTrial,
        currTrial,
        setTrialData,
        deleteDevice,
        deleteDeviceType,
        selection: state.selection,
        setSelection: val => setState(draft => { draft.selection = val; }),
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