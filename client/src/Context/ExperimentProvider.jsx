import { createContext, useContext, useEffect, useState } from "react";
import { RealMapName } from "../constants/constants";
import { parseUrlParams, replaceUrlParams } from "../Utils/utils";
import { useFetchExperiments } from "./FetchExperiment";
import { assignUuids } from "./TrackUuidUtils";
import { useTokenStore } from "./useTokenStore";
import { useUndoRedo } from "../App/UndoRedo/useUndoRedo";
import { useExperiments } from "./useExperiments";
import { useChosenTrial } from "./useChosenTrial";

const experimentContext = createContext();

export const ExperimentProvider = ({ children }) => {
    const [state, setState] = useState({
        showImagePlacement: false,
        hiddenDeviceTypes: {},
    });

    const { setExperiment, setAllExperiments, experiments, getExperiment } = useExperiments();
    const { experiment, trialType, trial, shownMap, chooseTrial, chooseShownMap } = useChosenTrial();

    const { isLoggedIn } = useTokenStore();
    const {
        fetchAllExperiments,
        // fetchExperimentListInfo,
        // fetchExperiment,
    } = useFetchExperiments();

    const FindTrialByName = ({ experimentName, trialTypeName, trialName }, allExperiments) => {
        if (allExperiments) {
            const experimentIndex = allExperiments.findIndex(t => t.name === experimentName);
            if (experimentIndex >= 0) {
                const experiment = allExperiments[experimentIndex];
                const trialTypes = (experiment || {}).trialTypes || [];

                if (!trialTypeName && trialTypes.length > 0) {
                    const trialType = experiment.trialTypes[0];
                    const trials = (trialType || {}).trials || [];
                    if (trials.length > 0) {
                        return {
                            experimentName, experimentIndex,
                            trialTypeName: trialType.name, trialTypeIndex: 0,
                            trialName: trials[0].name, trialIndex: 0,
                        };
                    }
                }

                const trialTypeIndex = trialTypes.findIndex(t => t.name === trialTypeName);
                if (trialTypeIndex >= 0) {
                    const trialType = experiment.trialTypes[trialTypeIndex];
                    const trialIndex = ((trialType || {}).trials || []).findIndex(t => t.name === trialName);
                    if (trialIndex >= 0) {
                        return {
                            experimentName, experimentIndex,
                            trialTypeName, trialTypeIndex,
                            trialName, trialIndex,
                        };
                    }
                }

                return {
                    experimentName, experimentIndex,
                };
            }
        }
        return {};
    }

    // const FindTrialByIndices = (currTrial, allExperiments) => {
    //     if (currTrial.experimentIndex === undefined) {
    //         return {};
    //     }
    //     const experiment = allExperiments[currTrial.experimentIndex];
    //     if (currTrial.trialIndex === undefined) {
    //         return {
    //             ...currTrial,
    //             experiment
    //         }
    //     }
    //     const trialType = ((experiment || {}).trialTypes || [])[currTrial.trialTypeIndex];
    //     const trial = ((trialType || {}).trials || [])[currTrial.trialIndex];
    //     return {
    //         ...currTrial,
    //         experiment,
    //         trialType,
    //         trial,
    //     }
    // }

    // const ReplaceUrlByTrial = (currTrial) => {
    //     replaceUrlParams({
    //         experimentName: experiment?.name,
    //         trialTypeName: trialType?.name,
    //         trialName: trial?.name,
    //     });
    // }

    // const GetCurrTrial = () => {
    //     return FindTrialByIndices(state.currTrial, experiments);
    // }

    const currTrial = {
        experiment,
        trialType,
        trial,
        shownMap,
        experimentName: experiment?.name, // this field is for legacy
        trialTypeName: trialType?.name, // this field is for legacy
        trialName: trial?.name, // this field is for legacy
    };

    const setCurrTrial = ({ experimentName, trialTypeName, trialName }) => {
        const sameExperiment = experimentName === experiment?.name;
        chooseTrial({ experimentName, trialTypeName, trialName });
        if (!sameExperiment) {
            setState(prev => ({ ...prev, hiddenDeviceTypes: {} }));
        }
    }

    const setShownMap = (shownMapName) => {
        if (state.currTrial.experimentName) {
            const experiment = experiments[state.currTrial.experimentIndex];
            const shownMapIndex = (experiment.imageStandalone || []).findIndex(t => t.name === shownMapName);
            if (shownMapIndex >= 0) {
                // replaceUrlParams({ shownMapName });
                setState(prev => ({
                    ...prev,
                    currTrial: { ...prev.currTrial, shownMapName, shownMapIndex },
                }));
                return;
            }
        }
        // replaceUrlParams({ shownMapName: undefined });
        setState(prev => ({
            ...prev,
            currTrial: { ...prev.currTrial, shownMapName: undefined, shownMapIndex: undefined },
        }));
    }

    const setTrialData = (data) => {
        if (state.currTrial.trialName === undefined) {
            console.log(`trying to set trial data without current trial\n`, data);
            return;
        }
        const e = structuredClone(currTrial.experiment);
        e.trialTypes[currTrial.trialTypeIndex].trials[currTrial.trialIndex] = data;
        setExperiment(currTrial.experimentName, e)
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
                const idev = devicesOnTrial.findIndex(t => {
                    return t.deviceItemName === deviceItemName && t.deviceTypeName === deviceTypeName;
                });
                if (coordinates) {
                    if (coordinates.lat) {
                        coordinates = [coordinates.lat, coordinates.lng];
                    }
                    const location = { name: mapName, coordinates };
                    if (idev !== -1) {
                        devicesOnTrial[idev] = { ...devicesOnTrial[idev], location }; // Done like this because location is frozen
                    } else {
                        devicesOnTrial.push({ deviceTypeName, deviceItemName, location });
                    }
                    count++;
                } else {
                    if (idev !== -1) {
                        devicesOnTrial.splice(idev, 1);
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

    const deleteDevice = ({ experimentName, deviceItemName, deviceTypeName }) => {
        const e = structuredClone(experiments.find(e => e.name === experimentName));
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
        setExperiment(currTrial.experimentName, e)
    }

    const deleteDeviceType = ({ experimentName, deviceTypeName }) => {
        const e = structuredClone(experiments.find(e => e.name === experimentName));
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
        setExperiment(currTrial.experimentName, e)
    }

    useEffect(() => {
        (async () => {
            if (isLoggedIn()) {
                const { experimentName, trialTypeName, trialName } = parseUrlParams();

                // $$$$ TODO: 
                // 1. read experiment list, show it from the info
                // 2. read just the chosen experiment
                // 3. switch experiment and read from backend
                // const experimentsNames = await fetchExperimentListInfo();
                const allExperiments = await fetchAllExperiments(); // TODO: move this to a separate component

                // console.log("experimentsNames", experimentsNames)
                // console.log("allExperiments", allExperiments)
                assignUuids(allExperiments);
                setAllExperiments(allExperiments);
                const t = FindTrialByName({ experimentName, trialTypeName, trialName }, allExperiments);
                setState(prev => ({
                    ...prev,
                    currTrial: t,
                }));
                setTimeout(() => {
                    useUndoRedo.getState().setTrackChanges(true);
                }, 100);
            }
        })()
    }, [isLoggedIn()])

    useEffect(() => {
        if (currTrial?.experimentName) {
            const experiment = experiments.find(t => t.name === currTrial?.experimentName);
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
        experiments,
        setCurrTrial,
        currTrial,
        setTrialData,
        deleteDevice,
        deleteDeviceType,
        setLocationsToDevices,
        setShownMap,
        showImagePlacement: state.showImagePlacement,
        setShowImagePlacement: val => setState(prev => ({ ...prev, showImagePlacement: val })),
        hiddenDeviceTypes: state.hiddenDeviceTypes,
        setHiddenDeviceTypes: val => setState(prev => ({ ...prev, hiddenDeviceTypes: val })),
    };

    return (
        <experimentContext.Provider value={store}>
            {children}
        </experimentContext.Provider>
    )
}

// useExperimentProvider should be at the end to avoid reload problems
export const useExperimentProvider = () => useContext(experimentContext);
