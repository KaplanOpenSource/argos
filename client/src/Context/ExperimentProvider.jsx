import { createContext, useContext, useEffect, useState } from "react"
import { parseUrlParams, replaceUrlParams } from "../Utils/utils";
import { useFetchExperiments } from "./FetchExperiment";
import { RealMapName } from "../constants/constants";
import { ExperimentUpdates } from "./ExperimentUpdates";
import { TrialChoosing } from "./TrialChoosing";
import { assignUuids } from "./TrackUuidUtils";
import { TokenContext } from "../App/TokenContext";

export const experimentContext = createContext();

export function change(thing, func) {
    const draft = structuredClone(thing);
    func(draft);
    return draft;
}

export const ExperimentProvider = ({ children }) => {
    const [selection, setSelection] = useState([]);
    const [hiddenDeviceTypes, setHiddenDeviceTypes] = useState({});
    const [state, setState] = useState({
        showImagePlacement: false,
        ...ExperimentUpdates.initialState,
        ...TrialChoosing.initialState,
    });

    const { hasToken } = useContext(TokenContext);
    const { fetchAllExperiments, saveExperimentWithData } = useFetchExperiments();

    const experimentUpdates = new ExperimentUpdates(state, setState);
    const trialChoosing = new TrialChoosing(state, setState);

    const currTrial = trialChoosing.GetCurrTrial();

    const setCurrTrial = ({ experimentName, trialTypeName, trialName }) => {
        const t = TrialChoosing.FindTrialByName({ experimentName, trialTypeName, trialName }, state.experiments);
        TrialChoosing.ReplaceUrlByTrial(t);
        setState(prev => { return { ...prev, currTrial: t }; });
        if (experimentName !== state?.currTrial?.experimentName) {
            setHiddenDeviceTypes({});
        }
    }

    const setShownMap = (shownMapName) => {
        if (state.currTrial.experimentName) {
            const experiment = state.experiments[state.currTrial.experimentIndex];
            const shownMapIndex = experiment.imageStandalone.findIndex(t => t.name === shownMapName);
            if (shownMapIndex >= 0) {
                replaceUrlParams({ shownMapName });
                setState(change(state, draft => {
                    draft.currTrial.shownMapName = shownMapName;
                    draft.currTrial.shownMapIndex = shownMapIndex;
                }));
                return;
            }
        }
        replaceUrlParams({ shownMapName: undefined });
        setState(change(state, draft => {
            draft.currTrial.shownMapName = undefined;
            draft.currTrial.shownMapIndex = undefined;
        }));
    }


    const setTrialData = (data) => {
        if (state.currTrial.trialName === undefined) {
            console.log(`trying to set trial data without current trial\n`, data);
            return;
        }
        const e = structuredClone(currTrial.experiment);
        e.trialTypes[currTrial.trialTypeIndex].trials[currTrial.trialIndex] = data;
        experimentUpdates.setExperiment(currTrial.experimentName, e)
    }

    const setLocationsToDevices = (deviceTypeItems, latlngs) => {
        const { trial } = currTrial;
        const mapName = currTrial.shownMapName || RealMapName;
        let count = 0;
        if (trial) {
            const devicesOnTrial = [...(trial.devicesOnTrial || [])];
            for (let i = 0, il = Math.min(deviceTypeItems.length, latlngs.length); i < il; ++i) {
                const { deviceTypeName, deviceItemName } = deviceTypeItems[i];
                let coordinates = latlngs[i];
                if (coordinates) {
                    if (coordinates.lat) {
                        coordinates = [coordinates.lat, coordinates.lng];
                    }
                    const location = { name: mapName, coordinates };
                    const i = devicesOnTrial.findIndex(t => {
                        return t.deviceItemName === deviceItemName && t.deviceTypeName === deviceTypeName;
                    });
                    if (i !== -1) {
                        devicesOnTrial[i] = { ...devicesOnTrial[i], location }; // Done like this because location is frozen
                    } else {
                        devicesOnTrial.push({ deviceTypeName, deviceItemName, location });
                    }
                    count++;
                }
            }
            if (count > 0) {
                const data = { ...trial, devicesOnTrial };
                setTrialData(data);
            }
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
        const e = structuredClone(state.experiments.find(e => e.name === experimentName));
        if (!e) {
            console.log(`unknown experiment ${experimentName}`);
            return;
        }
        const dt = (e.deviceTypes || []).find(t => t.name === deviceTypeName);
        if (dt && dt.devices) {
            dt.devices = dt.devices.filter(d => d.name !== deviceItemName);
        }
        for (const tt of (e.trialTypes || [])) {
            for (const tr of (tt.trials || [])) {
                if (tr && tr.devicesOnTrial) {
                    tr.devicesOnTrial = tr.devicesOnTrial.filter(d => !(d.deviceTypeName === deviceTypeName && d.deviceItemName === deviceItemName));
                }
            }
        }
        experimentUpdates.setExperiment(currTrial.experimentName, e)
    }

    const deleteDeviceType = ({ experimentName, deviceTypeName }) => {
        const e = structuredClone(state.experiments.find(e => e.name === experimentName));
        if (!e) {
            console.log(`unknown experiment ${experimentName}`);
            return;
        }
        e.deviceTypes = (e.deviceTypes || []).filter(t => t.name !== deviceTypeName);
        for (const tt of (e.trialTypes || [])) {
            for (const tr of (tt.trials || [])) {
                if (tr && tr.devicesOnTrial) {
                    tr.devicesOnTrial = tr.devicesOnTrial.filter(d => d.deviceTypeName !== deviceTypeName);
                }
            }
        }
        experimentUpdates.setExperiment(currTrial.experimentName, e)
    }

    useEffect(() => {
        (async () => {
            if (hasToken) {
                const { experimentName, trialTypeName, trialName } = parseUrlParams();
                const allExperiments = await fetchAllExperiments();
                assignUuids(allExperiments);
                const t = TrialChoosing.FindTrialByName({ experimentName, trialTypeName, trialName }, allExperiments);
                TrialChoosing.ReplaceUrlByTrial(t);
                setState(change(state, draft => {
                    draft.experiments = allExperiments;
                    draft.currTrial = t;
                }));
            }
        })()
    }, [hasToken])

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

    useEffect(() => {
        if (currTrial?.experimentName) {
            console.log(currTrial)
            const experiment = state?.experiments?.find(t => t.name === currTrial?.experimentName);
            if (!experiment) {
                setCurrTrial({});
            } else {
                if (currTrial?.trialName) {
                    const trialType = experiment?.trialTypes?.find(t => t.name === currTrial?.trialTypeName);
                    const trial = trialType?.trials?.find(t => t.name === currTrial?.trialName);
                    if (!trial) {
                        // TODO: handle selected standalone map
                        setCurrTrial({ experimentName: experiment.name });
                    }
                }
            }
        }
    }, [state]);

    const store = {
        experiments: state.experiments,
        deleteExperiment: experimentUpdates.deleteExperiment,
        addExperiment: experimentUpdates.addExperiment,
        setExperiment: experimentUpdates.setExperiment,
        undoOperation: experimentUpdates.undoOperation,
        redoOperation: experimentUpdates.redoOperation,
        undoPossible: state.undoStack.length > 0,
        redoPossible: state.redoStack.length > 0,
        setCurrTrial,
        currTrial,
        setTrialData,
        deleteDevice,
        deleteDeviceType,
        selection,
        setSelection,
        setLocationsToDevices,
        setLocationsToStackDevices,
        setShownMap,
        showImagePlacement: state.showImagePlacement,
        setShowImagePlacement: val => setState(change(state, draft => { draft.showImagePlacement = val; })),
        hiddenDeviceTypes,
        setHiddenDeviceTypes,
    };

    return (
        <experimentContext.Provider value={store}>
            {children}
        </experimentContext.Provider>
    )
}