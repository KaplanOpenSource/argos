import { ITrial } from '../types';
import { DeviceTypeObj, DeviceOnTrialObj, AttributeObj } from '.';

export class TrialObj implements ITrial {
    name: string;
    createdDate?: string;
    protected _devicesOnTrial: DeviceOnTrialObj[] = [];
    description?: string;
    attributes: AttributeObj[] = [];
    protected readonly deviceTypes: DeviceTypeObj[];

    constructor(data: ITrial, deviceTypes: DeviceTypeObj[]) {
        if (!data.name) {
            throw new Error('Trial name is required');
        }
        this.name = data.name;
        this.createdDate = data.createdDate;
        this.deviceTypes = deviceTypes;
        
        // First create all devices
        this._devicesOnTrial = data.devicesOnTrial?.map(device => {
            const deviceType = deviceTypes.find(dt => dt.name === device.deviceTypeName);
            if (!deviceType) {
                throw new Error(`Device type ${device.deviceTypeName} not found`);
            }
            const deviceItem = deviceType.devices.find(d => d.name === device.deviceItemName);
            if (!deviceItem) {
                throw new Error(`Device item ${device.deviceItemName} not found in type ${device.deviceTypeName}`);
            }
            return new DeviceOnTrialObj(device, deviceItem, this);
        }) || [];

        // Then set up containedIn relationships
        for (let i = 0; i < this._devicesOnTrial.length; i++) {
            this._devicesOnTrial[i].setContainedIn(data.devicesOnTrial?.[i].containedIn);
        }

        this.description = data.description;
        this.attributes = data.attributes?.map(attr => new AttributeObj(attr)) || [];
    }

    private filterValidDevices(devices: DeviceOnTrialObj[]): DeviceOnTrialObj[] {
        return devices.filter(device => {
            const deviceType = device.deviceItem.deviceType;
            // Check if device type exists and is still in the experiment's deviceTypes list
            return deviceType && device.deviceItem &&
                   deviceType.devices.includes(device.deviceItem) &&
                   this.deviceTypes.includes(deviceType);
        });
    }

    get devicesOnTrial(): DeviceOnTrialObj[] {
        return this.filterValidDevices(this._devicesOnTrial);
    }

    set devicesOnTrial(devices: DeviceOnTrialObj[]) {
        this._devicesOnTrial = this.filterValidDevices(devices);
    }

    toJson(): ITrial {
        const result: ITrial = {
            name: this.name,
            createdDate: this.createdDate,
            description: this.description
        };
        if (this.devicesOnTrial.length > 0) {
            result.devicesOnTrial = this.devicesOnTrial.map(device => device.toJson());
        }
        if (this.attributes.length > 0) {
            result.attributes = this.attributes.map(attr => attr.toJson());
        }
        return result;
    }
}
