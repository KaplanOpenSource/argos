import { IDeviceOnTrial, IDeviceTypeAndItem } from '../types';
import { DeviceItemObj, TrialObj, LocationObj, AttributeObj } from '.';

export class DeviceOnTrialObj implements IDeviceOnTrial {
    readonly deviceItem: DeviceItemObj;
    readonly trial: TrialObj;
    location?: LocationObj;
    attributes: AttributeObj[] = [];
    containedIn?: DeviceOnTrialObj;

    constructor(data: IDeviceOnTrial, deviceItem: DeviceItemObj, trial: TrialObj) {
        this.deviceItem = deviceItem;
        this.trial = trial;
        this.location = data.location ? new LocationObj(data.location) : undefined;
        this.attributes = data.attributes?.map(attr => new AttributeObj(attr)) || [];
    }

    setContainedIn(containedIn?: IDeviceTypeAndItem) {
        this.containedIn = this.trial?.devicesOnTrial?.find(d => 
            d.deviceTypeName === containedIn?.deviceTypeName &&
            d.deviceItemName === containedIn?.deviceItemName
        );
    }

    get deviceTypeName(): string {
        return this.deviceItem.deviceType.name;
    }

    get deviceItemName(): string {
        return this.deviceItem.name;
    }

    toJson(): IDeviceOnTrial {
        const result: IDeviceOnTrial = {
            deviceTypeName: this.deviceTypeName,
            deviceItemName: this.deviceItemName,
            location: this.location?.toJson()
        };
        if (this.containedIn) {
            result.containedIn = {
                deviceTypeName: this.containedIn.deviceTypeName,
                deviceItemName: this.containedIn.deviceItemName
            };
        }
        if (this.attributes.length > 0) {
            result.attributes = this.attributes.map(attr => attr.toJson());
        }
        return result;
    }
}
