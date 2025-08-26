import { v4 as uuidv4 } from 'uuid';
import { AttributeTypeObj, DeviceOnTrialObj, DeviceTypeObj, TrialObj } from '.';
import { ScopeEnum } from '../types/ScopeEnum';
import { IDevice, IDeviceTypeAndItem } from '../types/types';
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

  getAttributeValue(
    attrType: AttributeTypeObj,
    trial: TrialObj,
    deviceOnTrialIfAvailable: DeviceOnTrialObj | undefined = undefined, // will search if undefined
  ) {
    if (attrType.scope === ScopeEnum.SCOPE_TRIAL) {
      let dev = deviceOnTrialIfAvailable ?? trial.findDevice(this.asNames());
      for (let i = 100; i && dev; --i) {  // counter to avoid infinite loop
        const attr = dev.findAttr(attrType.name);
        if (attr?.value != null) { // != checks undefined and null
          return attr.value;
        }
        dev = dev.containedIn;
      }
    }
    if (attrType.scope !== ScopeEnum.SCOPE_CONSTANT) {
      const cand = this.findAttr(attrType.name);
      if (cand?.value != null) { // != checks undefined and null
        return cand.value;
      }
    }
    return attrType.defaultValue ?? '';
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
