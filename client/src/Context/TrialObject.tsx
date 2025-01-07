import { ITrial } from "../types/types";
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
        return (this.getTrialData()?.devicesOnTrial || []).map(d => this.getDevice(d.deviceTypeName, d.deviceItemName));
    }

    createDraft(): TrialObject {
        let draft = structuredClone(this.getTrialData());
        return new TrialObject(() => draft, (newTrialData) => draft = newTrialData);
    }
}