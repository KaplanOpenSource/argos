import React from "react";
import { createContext, useContext, useState } from "react";
import { RealMapName } from "../constants/constants";
import { useExperiments } from "./useExperiments";
import { useChosenTrial } from "./useChosenTrial";
import { ICoordinates, IDeviceTypeAndItem, ITrial } from "../types/types";

const experimentContext = createContext(null);

export const ExperimentProvider = ({ children }) => {
    const [state, setState] = useState({
        showImagePlacement: false,
    });

    const { setExperiment, experiments } = useExperiments();
    const { experiment,
        trialType,
        trial,
        shownMap,
        chooseTrial,
        setTrialIntoExp,
    } = useChosenTrial();

    const currTrial = {
        experiment: experiment(),
        trialType: trialType(),
        trial: trial(),
        shownMap,
        shownMapName: shownMap?.name,
        experimentName: experiment()?.name, // this field is for legacy
        trialTypeName: trialType()?.name, // this field is for legacy
        trialName: trial()?.name, // this field is for legacy
    };

    const setCurrTrial = ({
        experimentName,
        trialTypeName,
        trialName,
    }: {
        experimentName?: string | undefined,
        trialTypeName?: string | undefined,
        trialName?: string | undefined,
    }) => {
        chooseTrial({ experimentName, trialTypeName, trialName });
    }

    const setTrialData = (newTrialData: ITrial) => {
        const e = structuredClone(experiment());
        if (setTrialIntoExp(newTrialData, e)) {
            setExperiment(e!.name!, e!)
        }
    }

    const setLocationsToDevices = (
        deviceTypeItems: IDeviceTypeAndItem[],
        latlngs: (ICoordinates | { lat: number; lng: number; })[]) => {
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
                    if ('lat' in coordinates) {
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
        if (!e || !e.name) {
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
        setExperiment(e.name, e)
    }

    const deleteDeviceType = ({ experimentName, deviceTypeName }) => {
        const e = structuredClone(experiments.find(e => e.name === experimentName));
        if (!e || !e.name) {
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
        setExperiment(e.name, e)
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
    };

    return (
        <experimentContext.Provider value={store}>
            {children}
        </experimentContext.Provider>
    )
}

// useExperimentProvider should be at the end to avoid reload problems
export const useExperimentProvider = () => useContext(experimentContext);
