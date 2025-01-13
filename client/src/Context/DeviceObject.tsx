import { RealMapName } from "../constants/constants";
import { ICoordinates, IDeviceOnTrial, IDeviceTypeAndItem, ILocation } from "../types/types";
import { TrialObject } from "./TrialObject";

export const isSameName = (one: IDeviceTypeAndItem, two: IDeviceTypeAndItem) => {
    return one.deviceTypeName === two.deviceTypeName && one.deviceItemName === two.deviceItemName;
}

export class DeviceObject implements IDeviceTypeAndItem {
    private indexOnTrial: number = -1;

    constructor(
        public deviceTypeName: string,
        public deviceItemName: string,
        public trial: TrialObject,
    ) {

    }

    isSame(other: DeviceObject) {
        const thisOnTrial = this.onTrial();
        const otherOnTrial = other?.onTrial();
        return thisOnTrial && otherOnTrial && isSameName(thisOnTrial, otherOnTrial);
    }

    onTrial(): IDeviceOnTrial | undefined {
        const devicesOnTrial = this.trial?.getTrialData()?.devicesOnTrial || [];
        if (this.indexOnTrial === -1) {
            this.indexOnTrial = devicesOnTrial.findIndex(d => {
                return isSameName(d, this);
            });
        }
        return devicesOnTrial[this.indexOnTrial];
    }

    setOnTrial(newData: IDeviceOnTrial | undefined): void {
        const trialData = {
            ...(this.trial?.getTrialData() || {}),
            devicesOnTrial: [...(this.trial?.getTrialData()?.devicesOnTrial || [])]
        };

        if (!newData) {
            trialData.devicesOnTrial = trialData.devicesOnTrial.filter(d => !isSameName(d, this));
        } else {
            // Make sure data has the same name
            const namedData = { ...newData, ...(this as IDeviceTypeAndItem) };
            const dev = this.onTrial();
            if (dev) {
                trialData.devicesOnTrial[this.indexOnTrial] = namedData;
            } else {
                trialData.devicesOnTrial.push(namedData);
            }
        }
        this.trial.setTrialData(trialData);
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
        const mapName = checkMapName || RealMapName; // default map is the real map
        return loc?.coordinates !== undefined && loc?.name === mapName;
    }

    setLocation(location: ILocation | undefined) {
        if (!location) {
            this.setOnTrial(undefined);
        } else {
            const dev = this.onTrial();
            if (!dev) {
                this.setOnTrial({ ...(this as IDeviceTypeAndItem), location });
            } else {
                const newData: IDeviceOnTrial = { ...dev, location };
                delete newData.containedIn;
                this.setOnTrial(newData);
            }
        }
    }

    setLocationOnMap(coordinates: ICoordinates | undefined, mapName: string | undefined = undefined) {
        if (!coordinates) {
            this.setLocation(undefined)
        } else {
            const name = mapName || RealMapName; // default map is the real map
            this.setLocation({ name, coordinates });
        }
    }

    hasParent(other: DeviceObject) {
        if (this.onTrial() && other.onTrial()) {
            const containedIn = this.onTrial()?.containedIn;
            return containedIn?.deviceItemName === other?.deviceItemName
                && containedIn?.deviceTypeName === other?.deviceTypeName;
        }
        return false;
    }

    /** Sets the parent device of this device */
    setParent(futureParent: DeviceObject | undefined) {
        if (futureParent && this.isSame(futureParent)) {
            return;
        }
        const dev = this.onTrial();
        const parent = futureParent?.onTrial();
        if (parent) {
            const containedIn = { deviceItemName: parent.deviceItemName, deviceTypeName: parent.deviceTypeName };
            if (dev) {
                const newDeviceData = { ...dev, containedIn };
                delete newDeviceData.location;
                this.setOnTrial(newDeviceData);
            } else {
                this.setOnTrial({ ...(this as IDeviceTypeAndItem), containedIn });
            }
        } else {
            if (dev) {
                const newData = { ...dev };
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
