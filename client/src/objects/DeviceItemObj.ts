import { v4 as uuidv4 } from 'uuid';
import { AttributeObj, DeviceTypeObj } from '.';
import { IDevice } from '../types/types';

export class DeviceItemObj implements IDevice {
  readonly deviceType: DeviceTypeObj;
  name: string;
  attributes: AttributeObj[] = [];
  trackUuid: string;

  constructor(data: IDevice, deviceType: DeviceTypeObj) {
    if (!data.name) {
      throw new Error('Device name is required');
    }
    this.deviceType = deviceType;
    this.name = data.name;

    // Process attributes
    if (data.attributes) {
      for (const attr of data.attributes) {
        const attrType = this.deviceType.attributeTypes?.find(at => at.name === attr.name);
        if (attrType) {
          this.attributes.push(new AttributeObj(attr, attrType));
        }
      }
    }

    this.trackUuid = data.trackUuid || uuidv4();
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
