import { AttributeObj, DeviceTypeObj } from '.';
import { IDevice } from '../types/types';

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
    this.attributes = data.attributes?.map(attr => {
      const attrType = this.deviceType.attributeTypes?.find(at => at.name === attr.name);
      if (!attrType) {
        throw new Error(`Attribute type ${attr.name} not found in device type ${this.deviceType.name}`);
      }
      return new AttributeObj(attr, attrType);
    }) || [];
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
