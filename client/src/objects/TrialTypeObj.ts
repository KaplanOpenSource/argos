import { v4 as uuidv4 } from 'uuid';
import { AttributeTypeObj, DeviceTypeObj, TrialObj } from '.';
import { ITrialType } from '../types/types';

export class TrialTypeObj implements ITrialType {
  name: string;
  trials: TrialObj[] = [];
  attributeTypes: AttributeTypeObj[] = [];
  trackUuid: string;

  constructor(data: ITrialType, deviceTypes: DeviceTypeObj[]) {
    if (!data.name) {
      throw new Error('TrialType name is required');
    }
    this.name = data.name;
    this.attributeTypes = data.attributeTypes?.map(attr => new AttributeTypeObj(attr)) || [];
    this.trials = data.trials?.map(trial => new TrialObj(trial, deviceTypes, this)) || [];
    this.trackUuid = data.trackUuid || uuidv4();
  }

  toJson(): ITrialType {
    const result: ITrialType = {
      name: this.name
    };
    if (this.trials.length > 0) {
      result.trials = this.trials.map(trial => trial.toJson());
    }
    if (this.attributeTypes.length > 0) {
      result.attributeTypes = this.attributeTypes.map(attr => attr.toJson());
    }
    return result;
  }
}
