import { createContext, useContext, useState } from "react";
import { RealMapName } from "../constants/constants";
import { useExperiments } from "./useExperiments";
import { useChosenTrial } from "./useChosenTrial";

const experimentContext = createContext();

export const ExperimentProvider = ({ children }) => {
    const [state, setState] = useState({
        showImagePlacement: false,
        hiddenDeviceTypes: {},
    });

    const { setExperiment, experiments } = useExperiments();
    const { experiment, trialType, trial, shownMap, chooseTrial, isTrialChosen, chosenNames } = useChosenTrial();

    const currTrial = {
        experiment: experiment(),
        trialType: trialType(),
        trial: trial(),
        shownMap,
        experimentName: experiment()?.name, // this field is for legacy
        trialTypeName: trialType()?.name, // this field is for legacy
        trialName: trial()?.name, // this field is for legacy
    };

    const setCurrTrial = ({ experimentName, trialTypeName, trialName }) => {
        const sameExperiment = experimentName === experiment?.name;
        chooseTrial({ experimentName, trialTypeName, trialName });
        if (!sameExperiment) {
            setState(prev => ({ ...prev, hiddenDeviceTypes: {} }));
        }
    }

    const setTrialData = (newTrialData) => {
        if (!isTrialChosen()) {
            console.log(`trying to set trial data without current trial\n`, newTrialData);
            return;
        }
        const e = structuredClone(experiment());
        e.trialTypes[chosenNames.trialType.index].trials[chosenNames.trial.index] = newTrialData;
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

    const store = {
        experiments,
        setCurrTrial,
        currTrial,
        setTrialData,
        deleteDevice,
        deleteDeviceType,
        setLocationsToDevices,
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
