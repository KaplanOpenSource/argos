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
        return (this.getTrialData()?.devicesOnTrial || []).map((d, i) => {
            return new DeviceObject(d.deviceTypeName, d.deviceItemName, this, i);
        });
    }

    getDevicesByNames(names: IDeviceTypeAndItem[]) {
        return names.map(n => this.getDevice(n.deviceTypeName, n.deviceItemName));
    }

    /**
     * When updating multiple devices together, to avoid trial data corruption, the trial data should be submitted together.
     * @param trialMutation function that accepts a copy of the trial for multiple mutations that will be submitted together
     * @returns this
     */
    batch(trialMutation: (draft: TrialObject) => void): TrialObject {
        let draftData = structuredClone(this.getTrialData());
        const draft = new TrialObject(
            () => draftData,
            (newTrialData) => draftData = newTrialData
        );
        trialMutation(draft);
        this.setTrialData(draft.getTrialData());
        return this;
    }
}