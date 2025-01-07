import { DeviceObject } from "./DeviceObject";

export class TrialObject {
    constructor(
        public trialData: any,
        public setTrialData: any,
    ) {

    }

    getDevice(
        deviceTypeName: string,
        deviceItemName: string,
    ) {
        return new DeviceObject(deviceTypeName, deviceItemName, this);
    }
}