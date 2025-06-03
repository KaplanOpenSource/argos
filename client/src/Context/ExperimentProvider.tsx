import { createContext, useContext } from "react";
import { IExperiment, IImageStandalone, ITrial, ITrialType } from "../types/types";
import { useChosenTrial } from "./useChosenTrial";
import { useExperiments } from "./useExperiments";

interface IExperimentProviderStore {
  setCurrTrial: (params: { experimentName?: string; trialTypeName?: string; trialName?: string; }) => void; // a function to set the current trial
  currTrial: {
    experiment: IExperiment | undefined;
    trialType: ITrialType | undefined; // the current trial type
    trial: ITrial | undefined; // the current trial
    shownMap: IImageStandalone | undefined; // the current shown map
    shownMapName: string | undefined; // the name of the current shown map
    experimentName: string | undefined; // the name of the current experiment (for legacy)
    trialTypeName: string | undefined; // the name of the current trial type (for legacy)
    trialName: string | undefined; // the name of the current trial (for legacy)
  }; // the current trial information
  setTrialData: (newTrialData: ITrial) => void; // a function to set the trial data
  deleteDevice: (params: { experimentName: string; deviceItemName: string; deviceTypeName: string; }) => void; // a function to delete a device
  deleteDeviceType: (params: { experimentName: string; deviceTypeName: string; }) => void; // a function to delete a device type
};

const experimentContext = createContext<IExperimentProviderStore | null>(null);

export const ExperimentProvider = ({ children }) => {
  const { setExperiment, experiments } = useExperiments();
  const {
    experiment,
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
    shownMap: shownMap(),
    shownMapName: shownMap()?.name,
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
    setCurrTrial,
    currTrial,
    setTrialData,
    deleteDevice,
    deleteDeviceType,
  };

  return (
    <experimentContext.Provider value={store}>
      {children}
    </experimentContext.Provider>
  )
}

// useExperimentProvider should be at the end to avoid reload problems
export const useExperimentProvider = () => useContext(experimentContext)!;
