import { v4 as uuidv4 } from 'uuid';
import { AttributeTypeObj, ExperimentObj, TrialObj } from '.';
import { ITrialType } from '../types/types';

export class TrialTypeObj implements ITrialType {
  name: string;
  trials: TrialObj[] = [];
  attributeTypes: AttributeTypeObj[] = [];
  trackUuid: string;

  constructor(
    data: ITrialType,
    readonly experiment: ExperimentObj,
  ) {
    if (!data.name) {
      throw new Error('TrialType name is required');
    }
    this.name = data.name;
    this.attributeTypes = data.attributeTypes?.map(attr => new AttributeTypeObj(attr)) || [];
    this.trials = data.trials?.map(trial => new TrialObj(trial, this.experiment.deviceTypes, this)) || [];
    this.trackUuid = data.trackUuid || uuidv4();
  }

  toJson(includeTrackUuid: boolean = false): ITrialType {
    const result: ITrialType = {
      name: this.name
    };
    if (this.trials.length > 0) {
      result.trials = this.trials.map(trial => trial.toJson(includeTrackUuid));
    }
    if (this.attributeTypes.length > 0) {
      result.attributeTypes = this.attributeTypes.map(attr => attr.toJson(includeTrackUuid));
    }
    if (includeTrackUuid) {
      result.trackUuid = this.trackUuid;
    }
    return result;
  }
}
