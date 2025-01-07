import { RealMapName } from "../constants/constants";
import { TrialObject } from "./TrialObject";

export class DeviceObject {
    private indexOnTrial: number = -1;

    constructor(
        public deviceTypeName: string,
        public deviceItemName: string,
        public trial: TrialObject,
    ) {

    }

    onTrial() {
        const devicesOnTrial = this.trial?.trialData?.devicesOnTrial || [];
        if (this.indexOnTrial === -1) {
            this.indexOnTrial = devicesOnTrial.findIndex(d => {
                return d.deviceTypeName === this.deviceTypeName && d.deviceItemName === this.deviceItemName;
            });
        }
        return devicesOnTrial[this.indexOnTrial];
    }

    setOnTrial(newData: any): void {
        const data = {
            ...(this.trial?.trialData || {}),
            devicesOnTrial: [...(this.trial?.trialData?.devicesOnTrial || [])]
        };
        data.devicesOnTrial[this.indexOnTrial] = newData;
        this.trial.setTrialData(data);
    }

    hasLocation(): boolean {
        return this.onTrial()?.location?.coordinates !== undefined;
    }

    hasLocationOnMap(checkMapName: string | undefined = undefined): boolean {
        return this.hasLocation() && this.onTrial()?.location?.name === (checkMapName || RealMapName);
    }

    isContainedIn(other: DeviceObject) {
        if (this.onTrial() && other.onTrial()) {
            const containedIn = this.onTrial()?.containedIn;
            return containedIn?.deviceItemName === other?.deviceItemName
                && containedIn?.deviceTypeName === other?.deviceTypeName;
        }
        return false;
    }

    isSame(other: DeviceObject) {
        return this.onTrial()?.deviceItemName === other?.onTrial()?.deviceItemName
            && this.onTrial()?.deviceTypeName === other?.onTrial()?.deviceTypeName;
    }

    /** Sets the parent device of this device */
    setContainedIn(futureParent: DeviceObject | undefined) {
        if (futureParent && this.isSame(futureParent)) {
            return;
        }
        if (this.onTrial()) {
            const newData = { ...this.onTrial() };
            const parent = futureParent?.onTrial();
            if (parent) {
                newData.containedIn = { deviceItemName: parent.deviceItemName, deviceTypeName: parent.deviceTypeName };
            } else {
                delete newData.containedIn;
            }
            this.setOnTrial(newData);
        }
    }
}
