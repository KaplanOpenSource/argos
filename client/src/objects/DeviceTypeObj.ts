import { v4 as uuidv4 } from 'uuid';
import { AttributeTypeObj, DeviceItemObj } from '.';
import { IDeviceType } from '../types/types';

export class DeviceTypeObj implements IDeviceType {
  name: string;
  devices: DeviceItemObj[] = [];
  attributeTypes: AttributeTypeObj[] = [];
  trackUuid: string;

  constructor(data: IDeviceType) {
    if (!data.name) {
      throw new Error('DeviceType name is required');
    }
    this.name = data.name;
    this.devices = data.devices?.map(device => new DeviceItemObj(device, this)) || [];
    this.attributeTypes = data.attributeTypes?.map(attr => new AttributeTypeObj(attr)) || [];
    this.trackUuid = data.trackUuid || uuidv4();
  }

  toJson(): IDeviceType {
    const result: IDeviceType = {
      name: this.name
    };
    if (this.devices.length > 0) {
      result.devices = this.devices.map(device => device.toJson());
    }
    if (this.attributeTypes.length > 0) {
      result.attributeTypes = this.attributeTypes.map(attr => attr.toJson());
    }
    return result;
  }
}
