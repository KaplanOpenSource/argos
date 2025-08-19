import { v4 as uuidv4 } from 'uuid';
import { DeviceItemObj, DeviceOnTrialObj, DeviceTypeObj, TrialTypeObj } from '.';
import { ICoordinates, IDeviceOnTrial, IDeviceTypeAndItem, ITrial, ScopeEnum } from '../types/types';
import { isSameDevice } from '../Utils/isSameDevice';
import { HasAttributesObj } from './HasAttributesObj';

export class TrialObj extends HasAttributesObj implements ITrial {
  name: string;
  createdDate?: string;
  protected _devicesOnTrial: DeviceOnTrialObj[] = [];
  description?: string;
  protected readonly deviceTypes: DeviceTypeObj[];
  readonly trialType: TrialTypeObj;
  trackUuid: string;

  constructor(data: ITrial, deviceTypes: DeviceTypeObj[], trialType: TrialTypeObj) {
    super(data, trialType.attributeTypes, ScopeEnum.SCOPE_TRIAL);
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

  findDeviceIndex(name: IDeviceTypeAndItem | undefined, addWhenNotOnTrial: boolean = false): number {
    if (name) {
      const devIndex = this.devicesOnTrial?.findIndex(d => isSameDevice(d, name));
      if (devIndex !== -1 || !addWhenNotOnTrial) {
        return devIndex;
      }
      const valids = this.filterValidDevices([name]);
      if (valids.length > 0) {
        const newDev = new DeviceOnTrialObj(valids[0].device, valids[0].deviceItem, this);
        this._devicesOnTrial.push(newDev);
        return this._devicesOnTrial.length - 1;
      }
    }
    return -1;
  }

  findDevice(name: IDeviceTypeAndItem | undefined, addWhenNotOnTrial: boolean = false): DeviceOnTrialObj | undefined {
    const i = this.findDeviceIndex(name, addWhenNotOnTrial);
    return i === -1 ? undefined : this._devicesOnTrial[i];
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
      description: this.description,
      ...super.toJson(includeTrackUuid),
    };

    const devicesOnTrial = this.devicesOnTrial
      .filter(device => device.location || device.containedIn)
      .map(device => device.toJson(includeTrackUuid));
    if (devicesOnTrial.length > 0) {
      result.devicesOnTrial = devicesOnTrial;
    }

    if (includeTrackUuid) {
      result.trackUuid = this.trackUuid;
    }
    return result;
  }
}
