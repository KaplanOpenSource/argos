import { create } from 'zustand';
import { IDeviceTypeAndItem } from "../types/types";

type DeviceSeletionStore = {
  selection: IDeviceTypeAndItem[],
  setSelection: (sel: IDeviceTypeAndItem[]) => void,
};

export const useDeviceSeletion = create<DeviceSeletionStore>()((set, get) => ({
  selection: [],
  setSelection: (sel: IDeviceTypeAndItem[]) => {
    set((state) => ({
      selection: sel,
    }))
  },
}))
