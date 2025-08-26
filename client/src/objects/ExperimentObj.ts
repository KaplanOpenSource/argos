import { v4 as uuidv4 } from 'uuid';
import { DeviceTypeObj, ImageEmbeddedObj, ImageStandaloneObj, ShapeObj, TrialObj, TrialTypeObj } from '.';
import { IExperiment } from '../types/types';
import { ExperimentChange } from './ExperimentChange';

export class ExperimentObj implements IExperiment {
  version?: string;
  startDate?: string;
  endDate?: string;
  description?: string;
  name: string;
  imageEmbedded: ImageEmbeddedObj[] = [];
  imageStandalone: ImageStandaloneObj[] = [];
  trialTypes: TrialTypeObj[] = [];
  deviceTypes: DeviceTypeObj[] = [];
  shapes: ShapeObj[] = [];
  trackUuid: string;

  constructor(data: IExperiment) {
    if (!data.name) {
      throw new Error('Experiment name is required');
    }
    this.version = data.version;
    this.startDate = data.startDate;
    this.endDate = data.endDate;
    this.description = data.description;
    this.name = data.name;
    this.trackUuid = data.trackUuid || uuidv4();

    this.imageEmbedded = data.imageEmbedded?.map(img => new ImageEmbeddedObj(img)) || [];
    this.imageStandalone = data.imageStandalone?.map(img => new ImageStandaloneObj(img)) || [];
    this.deviceTypes = data.deviceTypes?.map(type => new DeviceTypeObj(type)) || [];
    this.trialTypes = data.trialTypes?.map(type => new TrialTypeObj(type, this)) || [];
    this.shapes = data.shapes?.map(shape => new ShapeObj(shape)) || [];
  }

  getTrialTypeCount(): number {
    return this.trialTypes.length;
  }

  getTrialCount(): number {
    return this.trialTypes.reduce((sum, type) => sum + type.trials.length, 0);
  }

  getDeviceCount(): number {
    return this.deviceTypes.reduce((sum, type) => sum + type.devices.length, 0);
  }

  /** Find the trial with the same name even though it might be from another context */
  findTrial(trial: TrialObj): TrialObj | undefined {
    const trialType = this.trialTypes.find(tt => tt.name === trial.trialType.name);
    const foundTrial = trialType?.trials.find(tr => tr.name === trial.name);
    return foundTrial;
  }

  toJson(includeTrackUuid: boolean = false): IExperiment {
    const result: IExperiment = {
      version: this.version,
      startDate: this.startDate,
      endDate: this.endDate,
      description: this.description,
      name: this.name
    };
    if (this.imageEmbedded.length > 0) {
      result.imageEmbedded = this.imageEmbedded.map(img => img.toJson(includeTrackUuid));
    }
    if (this.imageStandalone.length > 0) {
      result.imageStandalone = this.imageStandalone.map(img => img.toJson(includeTrackUuid));
    }
    if (this.trialTypes.length > 0) {
      result.trialTypes = this.trialTypes.map(type => type.toJson(includeTrackUuid));
    }
    if (this.deviceTypes.length > 0) {
      result.deviceTypes = this.deviceTypes.map(type => type.toJson(includeTrackUuid));
    }
    if (this.shapes.length > 0) {
      result.shapes = this.shapes.map(shape => shape.toJson(includeTrackUuid));
    }
    if (includeTrackUuid) {
      result.trackUuid = this.trackUuid;
    }
    return result;
  }

  /**
   * Creates a new ExperimentChange instance for this experiment.
   * Use this to create a modified clone of the experiment while maintaining
   * references to specific objects.
   * @returns A new ExperimentChange instance
   */
  createChange(): ExperimentChange {
    return new ExperimentChange(this);
  }
}
