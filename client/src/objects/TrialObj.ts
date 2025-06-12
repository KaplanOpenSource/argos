import { v4 as uuidv4 } from 'uuid';
import { AttributeObj, DeviceItemObj, DeviceOnTrialObj, DeviceTypeObj, TrialTypeObj } from '.';
import { IDeviceOnTrial, ITrial } from '../types/types';

export class TrialObj implements ITrial {
  name: string;
  createdDate?: string;
  protected _devicesOnTrial: DeviceOnTrialObj[] = [];
  description?: string;
  attributes: AttributeObj[] = [];
  protected readonly deviceTypes: DeviceTypeObj[];
  readonly trialType: TrialTypeObj;
  trackUuid: string;

  constructor(data: ITrial, deviceTypes: DeviceTypeObj[], trialType: TrialTypeObj) {
    if (!data.name) {
      throw new Error('Trial name is required');
    }
    this.name = data.name;
    this.createdDate = data.createdDate;
    this.deviceTypes = deviceTypes;
    this.trialType = trialType;
    this.trackUuid = data.trackUuid || uuidv4();

    // First create all devices
    this._devicesOnTrial = this.filterValidDevices(data.devicesOnTrial)
      .map(({ device, deviceItem }) =>
        new DeviceOnTrialObj(device, deviceItem, this)
      );

    // Then set up containedIn relationships
    for (let i = 0; i < this._devicesOnTrial.length; i++) {
      this._devicesOnTrial[i].setContainedIn(data.devicesOnTrial?.[i].containedIn);
    }

    this.description = data.description;
    this.attributes = [];
    if (data.attributes) {
      for (const attr of data.attributes) {
        const attrType = this.trialType.attributeTypes?.find(at => at.name === attr.name);
        if (attrType) {
          this.attributes.push(new AttributeObj(attr, attrType));
        }
      }
    }
  }

  private filterValidDevices<T extends IDeviceOnTrial>(
    devices: T[] | undefined
  ): Array<{ device: T; deviceType: DeviceTypeObj; deviceItem: DeviceItemObj }> {
    const result: Array<{ device: T; deviceType: DeviceTypeObj; deviceItem: DeviceItemObj }> = [];
    for (const device of devices || []) {
      const deviceType = this.deviceTypes.find(dt => dt.name === device.deviceTypeName);
      if (deviceType && this.deviceTypes.includes(deviceType)) {
        const deviceItem = deviceType.devices.find(d => d.name === device.deviceItemName);
        if (deviceItem) {
          result.push({ device, deviceType, deviceItem });
        }
      }
    }
    return result;
  }

  get devicesOnTrial(): DeviceOnTrialObj[] {
    return this._devicesOnTrial;
  }

  set devicesOnTrial(devices: DeviceOnTrialObj[]) {
    // Only filter and assign valid DeviceOnTrialObj instances
    this._devicesOnTrial = this.filterValidDevices(devices)
      .map(({ device, deviceItem }) => {
        return new DeviceOnTrialObj(device, deviceItem, this);
      });
  }

  toJson(includeTrackUuid: boolean = false): ITrial {
    const result: ITrial = {
      name: this.name,
      createdDate: this.createdDate,
      description: this.description
    };
    if (this.devicesOnTrial.length > 0) {
      result.devicesOnTrial = this.devicesOnTrial.map(device => device.toJson(includeTrackUuid));
    }
    if (this.attributes.length > 0) {
      result.attributes = this.attributes.map(attr => attr.toJson(includeTrackUuid));
    }
    if (includeTrackUuid) {
      result.trackUuid = this.trackUuid;
    }
    return result;
  }
}
