import { create } from "zustand";
import { IExperiment } from "../types/types";
import { useTokenStore } from "./useTokenStore";
import { useFetchExperiments } from "./FetchExperiment";
import { useEffect } from "react";

interface HiddenDeviceTypesStore {
    hiddenDeviceTypes: { [deviceTypeName: string]: boolean },
    isDeviceTypeHidden: (deviceTypeName: string) => boolean,
    setDeviceTypeHidden: (deviceTypeName: string, v: boolean) => void,
    resetHiddenDeviceTypes: () => void,
}

export const useHiddenDeviceTypes = create<HiddenDeviceTypesStore>()((set, get) => ({
    hiddenDeviceTypes: {},
    isDeviceTypeHidden: (deviceTypeName: string) => get().hiddenDeviceTypes[deviceTypeName],
    setDeviceTypeHidden: (deviceTypeName: string, v: boolean) => {
        set(prev => {
            return ({ hiddenDeviceTypes: { ...prev.hiddenDeviceTypes, [deviceTypeName]: v } })
        })
    },
    resetHiddenDeviceTypes: () => {
        set({ hiddenDeviceTypes: {} });
    }
}))
