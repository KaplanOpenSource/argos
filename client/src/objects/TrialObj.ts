import { v4 as uuidv4 } from 'uuid';
import { AttributeObj, DeviceItemObj, DeviceOnTrialObj, DeviceTypeObj, TrialTypeObj } from '.';
import { ICoordinates, IDeviceOnTrial, IDeviceTypeAndItem, ITrial } from '../types/types';
import { isSameDevice } from '../Utils/isSameDevice';

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
      const containedIn = data.devicesOnTrial?.[i].containedIn;
      if (containedIn) {
        this._devicesOnTrial[i].setContainedIn(containedIn);
      }
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

  /**
   * Filters devices (given by item and type names) that exist on the experiment's device types
   * @param devices device item and type names
   * @returns the names and the objects of the devices that exist
   */
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

  findDevice(name: IDeviceOnTrial, addWhenNotOnTrial: boolean = false): DeviceOnTrialObj | undefined {
    const dev = this.devicesOnTrial?.find(d => isSameDevice(d, name));
    if (dev || !addWhenNotOnTrial) {
      return dev;
    }
    const valids = this.filterValidDevices([name]);
    if (valids.length > 0) {
      const newDev = new DeviceOnTrialObj(valids[0].device, valids[0].deviceItem, this);
      this._devicesOnTrial.push(newDev);
      return newDev;
    }
    return undefined;
  }

  setDeviceLocation(
    name: IDeviceOnTrial,
    coordinates: ICoordinates | undefined,
    mapName?: string,
    containedIn?: IDeviceTypeAndItem,
  ): DeviceOnTrialObj | undefined {
    if (coordinates || containedIn) {
      const dev = this.findDevice(name, true);
      if (dev) {
        if (containedIn) {
          dev.setContainedIn(containedIn);
        } else {
          dev.setLocationOnMap(coordinates, mapName);
        }
        return dev;
      }
    }
    this._devicesOnTrial = this._devicesOnTrial.filter(d => !isSameDevice(d, name));
    return undefined;
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
