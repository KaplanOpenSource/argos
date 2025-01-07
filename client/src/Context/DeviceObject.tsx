import { RealMapName } from "../constants/constants";
import { ILocation } from "../types/types";
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
        const devicesOnTrial = this.trial?.getTrialData()?.devicesOnTrial || [];
        if (this.indexOnTrial === -1) {
            this.indexOnTrial = devicesOnTrial.findIndex(d => {
                return d.deviceTypeName === this.deviceTypeName && d.deviceItemName === this.deviceItemName;
            });
        }
        return devicesOnTrial[this.indexOnTrial];
    }

    setOnTrial(newData: any): void {
        const data = {
            ...(this.trial?.getTrialData() || {}),
            devicesOnTrial: [...(this.trial?.getTrialData()?.devicesOnTrial || [])]
        };
        if (this.onTrial()) {
            data.devicesOnTrial[this.indexOnTrial] = newData;
        } else {
            data.devicesOnTrial.push({
                ...newData,
                deviceTypeName: this.deviceTypeName,
                deviceItemName: this.deviceItemName,
            });
        }
        this.trial.setTrialData(data);
    }

    getLocation(): ILocation | undefined {
        const parent = this.getParent();
        if (parent) {
            return parent.getLocation();
        } else {
            return this.onTrial()?.location;
        }
    }

    hasLocation(): boolean {
        return this.getLocation()?.coordinates !== undefined;
    }

    hasLocationOnMap(checkMapName: string | undefined = undefined): boolean {
        const loc = this.getLocation();
        return loc?.coordinates !== undefined && loc?.name === (checkMapName || RealMapName);
    }

    hasParent(other: DeviceObject) {
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
    setParent(futureParent: DeviceObject | undefined) {
        if (futureParent && this.isSame(futureParent)) {
            return;
        }
        const parent = futureParent?.onTrial();
        if (parent) {
            const containedIn = { deviceItemName: parent.deviceItemName, deviceTypeName: parent.deviceTypeName };
            if (this.onTrial()) {
                const newDeviceData = { ...this.onTrial(), containedIn };
                delete newDeviceData.location;
                this.setOnTrial(newDeviceData);
            } else {
                this.setOnTrial({ containedIn });
            }
        } else {
            if (this.onTrial()) {
                const newData = { ...this.onTrial() };
                delete newData.containedIn;
                this.setOnTrial(newData);
            }
        }
    }

    getParent(): DeviceObject | undefined {
        const containedIn = this.onTrial()?.containedIn;
        if (containedIn) {
            return new DeviceObject(containedIn.deviceTypeName, containedIn.deviceItemName, this.trial);
        }
    }
}
