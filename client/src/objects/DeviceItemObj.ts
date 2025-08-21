import { v4 as uuidv4 } from 'uuid';
import { DeviceTypeObj } from '.';
import { IDevice, IDeviceTypeAndItem, ScopeEnum } from '../types/types';
import { HasAttributesObj } from './HasAttributesObj';

export class DeviceItemObj extends HasAttributesObj implements IDevice {
  readonly deviceType: DeviceTypeObj;
  name: string;
  trackUuid: string;

  constructor(data: IDevice, deviceType: DeviceTypeObj) {
    super(data, deviceType.attributeTypes, ScopeEnum.SCOPE_EXPERIMENT);
    if (!data.name) {
      throw new Error('Device name is required');
    }
    this.deviceType = deviceType;
    this.name = data.name;
    this.trackUuid = data.trackUuid || uuidv4();
  }

  asNames(): IDeviceTypeAndItem {
    return { deviceItemName: this.name, deviceTypeName: this.deviceType.name };
  }

  toJson(includeTrackUuid: boolean = false): IDevice {
    const result: IDevice = {
      name: this.name,
      ...super.toJson(includeTrackUuid),
    };
    if (includeTrackUuid) {
      result.trackUuid = this.trackUuid;
    }
    return result;
  }
}
