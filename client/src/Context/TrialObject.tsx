import { DeviceObject } from "./DeviceObject";

export class TrialObject {
    constructor(
        public getTrialData: any,
        public setTrialData: any,
    ) {

    }

    getDevice(
        deviceTypeName: string,
        deviceItemName: string,
    ) {
        return new DeviceObject(deviceTypeName, deviceItemName, this);
    }

    getDevicesOnTrial() {
        return (this.getTrialData()?.devicesOnTrial || []).map(d => this.getDevice(d.deviceTypeName, d.deviceItemName));
    }

    createDraft(): TrialObject {
        let draft = structuredClone(this.getTrialData());
        return new TrialObject(() => draft, (newTrialData) => draft = newTrialData);
    }
}