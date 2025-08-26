import { v4 as uuidv4 } from 'uuid';
import { DeviceItemObj, LocationObj, TrialObj } from '.';
import { RealMapName } from '../constants/constants';
import { ScopeEnum } from '../types/ScopeEnum';
import { ICoordinates, IDeviceOnTrial, IDeviceTypeAndItem, ILocation } from '../types/types';
import { isSameDevice } from '../Utils/isSameDevice';
import { HasAttributesObj } from './HasAttributesObj';

export class DeviceOnTrialObj extends HasAttributesObj implements IDeviceOnTrial {
  readonly deviceItem: DeviceItemObj;
  readonly trial: TrialObj;
  location?: LocationObj;
  containedIn?: DeviceOnTrialObj;
  trackUuid: string;

  constructor(data: IDeviceOnTrial, deviceItem: DeviceItemObj, trial: TrialObj) {
    super(data, deviceItem.deviceType.attributeTypes, ScopeEnum.SCOPE_TRIAL);
    this.deviceItem = deviceItem;
    this.trial = trial;
    this.setLocation(data.location);
    this.trackUuid = data.trackUuid || uuidv4();
  }

  get stringName(): string {
    return `${this.deviceTypeName} : ${this.deviceItemName}`;
  }

  asNames(): IDeviceTypeAndItem {
    return { deviceItemName: this.deviceItemName, deviceTypeName: this.deviceTypeName };
  }

  isSame(other: IDeviceTypeAndItem | undefined) {
    return other && isSameDevice(this, other);
  }

  setContainedIn(containedIn?: IDeviceTypeAndItem) {
    this.containedIn = this.trial?.findDevice(containedIn);
    this.location = undefined;
  }

  setLocation(location: ILocation | undefined) {
    this.containedIn = undefined;
    if (location) {
      const imageStandalone = this.trial.trialType.experiment.imageStandalone.find(s => s.name === location?.name);
      this.location = new LocationObj(location, imageStandalone);
    } else {
      this.location = undefined;
    }
    // TODO: not sure if to add to trial, check
  }

  setLocationOnMap(coordinates: ICoordinates | undefined, mapName: string | undefined = undefined) {
    if (!coordinates) {
      this.setLocation(undefined)
    } else {
      this.setLocation({ name: mapName || RealMapName, coordinates }); // default map is the real map
    }
  }

  getLocationRecursive(): LocationObj | undefined {
    if (!this.location && this.containedIn) {
      return this.containedIn.getLocationRecursive();
    }
    return this.location;
  }

  getContainedDevices(): { dev: DeviceOnTrialObj; index: number; }[] {
    const ret: { dev: DeviceOnTrialObj; index: number; }[] = []
    this.trial.devicesOnTrial.forEach((dev, index) => {
      if (dev.containedIn && this.isSame(dev.containedIn)) {
        ret.push({ dev, index });
      }
    });
    return ret;
  }

  get deviceTypeName(): string {
    return this.deviceItem.deviceType.name;
  }

  get deviceItemName(): string {
    return this.deviceItem.name;
  }

  toJson(includeTrackUuid: boolean = false): IDeviceOnTrial {
    const result: IDeviceOnTrial = {
      deviceTypeName: this.deviceTypeName,
      deviceItemName: this.deviceItemName,
      location: this.location?.toJson(includeTrackUuid),
      ...super.toJson(includeTrackUuid),
    };
    if (this.containedIn) {
      result.containedIn = {
        deviceTypeName: this.containedIn.deviceTypeName,
        deviceItemName: this.containedIn.deviceItemName
      };
    }
    if (includeTrackUuid) {
      result.trackUuid = this.trackUuid;
    }
    return result;
  }
}
