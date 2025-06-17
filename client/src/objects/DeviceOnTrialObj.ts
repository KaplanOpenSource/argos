import { v4 as uuidv4 } from 'uuid';
import { AttributeObj, DeviceItemObj, LocationObj, TrialObj } from '.';
import { IDeviceOnTrial, IDeviceTypeAndItem } from '../types/types';
import { isSameDevice } from '../Utils/isSameDevice';

export class DeviceOnTrialObj implements IDeviceOnTrial {
  readonly deviceItem: DeviceItemObj;
  readonly trial: TrialObj;
  location?: LocationObj;
  attributes: AttributeObj[] = [];
  containedIn?: DeviceOnTrialObj;
  trackUuid: string;

  constructor(data: IDeviceOnTrial, deviceItem: DeviceItemObj, trial: TrialObj) {
    this.deviceItem = deviceItem;
    this.trial = trial;

    const imageStandalone = this.trial.trialType.experiment.imageStandalone.find(s => s.name === data.location?.name);
    this.location = data.location ? new LocationObj(data.location, imageStandalone) : undefined;

    // Process attributes
    if (data.attributes) {
      for (const attr of data.attributes) {
        const attrType = this.deviceItem.deviceType.attributeTypes?.find(at => at.name === attr.name);
        if (attrType) {
          this.attributes.push(new AttributeObj(attr, attrType));
        }
      }
    }

    this.trackUuid = data.trackUuid || uuidv4();
  }

  isSame(other: IDeviceOnTrial) {
    return isSameDevice(this, other);
  }

  setContainedIn(containedIn?: IDeviceTypeAndItem) {
    this.containedIn = this.trial?.devicesOnTrial?.find(d =>
      d.deviceTypeName === containedIn?.deviceTypeName &&
      d.deviceItemName === containedIn?.deviceItemName
    );
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
      location: this.location?.toJson(includeTrackUuid)
    };
    if (this.containedIn) {
      result.containedIn = {
        deviceTypeName: this.containedIn.deviceTypeName,
        deviceItemName: this.containedIn.deviceItemName
      };
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
