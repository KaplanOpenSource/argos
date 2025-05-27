import { IDevice } from '../types';
import { DeviceTypeObj, AttributeObj } from '.';

export class DeviceItemObj implements IDevice {
    readonly deviceType: DeviceTypeObj;
    name: string;
    attributes: AttributeObj[] = [];

    constructor(data: IDevice, deviceType: DeviceTypeObj) {
        if (!data.name) {
            throw new Error('Device name is required');
        }
        this.deviceType = deviceType;
        this.name = data.name;
        this.attributes = data.attributes?.map(attr => new AttributeObj(attr)) || [];
    }

    toJson(): IDevice {
        const result: IDevice = {
            name: this.name
        };
        if (this.attributes.length > 0) {
            result.attributes = this.attributes.map(attr => attr.toJson());
        }
        return result;
    }
}
