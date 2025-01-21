import { IDeviceTypeAndItem, ITrial } from "../types/types";
import { DeviceObject } from "./DeviceObject";

export class TrialObject {
    constructor(
        public getTrialData: () => ITrial,
        public setTrialData: (newTrialData: ITrial) => void,
    ) {

    }

    getDevice(
        deviceTypeName: string,
        deviceItemName: string,
    ): DeviceObject {
        return new DeviceObject(deviceTypeName, deviceItemName, this);
    }

    getDevicesOnTrial(): DeviceObject[] {
        // TODO: optimize by setting DeviceObject.indexOnTrial internal member directly
        return (this.getTrialData()?.devicesOnTrial || []).map(d => this.getDevice(d.deviceTypeName, d.deviceItemName));
    }

    getDevicesByNames(names: IDeviceTypeAndItem[]) {
        return names.map(n => this.getDevice(n.deviceTypeName, n.deviceItemName));
    }

    /**
     * Draft is needed when updating few devices on one dom update, otherwise updated trial data will be corrupt.  
     * 
     * Usage:  
     * const draft = trial.createDraft();  
     * draft.getDevice(deviceTypeName1, deviceItemName1).setLocation(...);  
     * draft.getDevice(deviceTypeName2, deviceItemName2).setLocation(...);  
     * trial.setTrialData(draft.getTrialData());  
     * 
     * @returns deep clone of the trial
     */
    createDraft(): TrialObject {
        let draft = structuredClone(this.getTrialData());
        return new TrialObject(() => draft, (newTrialData) => draft = newTrialData);
    }
}