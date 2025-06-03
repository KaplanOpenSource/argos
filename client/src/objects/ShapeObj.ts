import { v4 as uuidv4 } from 'uuid';
import { ICoordinates, IShape } from '../types/types';

export class ShapeObj implements IShape {
  name: string;
  coordinates: ICoordinates[] = [];
  center?: ICoordinates;
  radius?: number;
  trackUuid: string;

  constructor(data: IShape) {
    if (!data.name) {
      throw new Error('Shape name is required');
    }
    this.name = data.name;
    this.coordinates = data.coordinates || [];
    this.center = data.center;
    this.radius = data.radius;
    this.trackUuid = data.trackUuid || uuidv4();
  }

  toJson(includeTrackUuid: boolean = false): IShape {
    const result: IShape = {
      name: this.name,
      center: this.center,
      radius: this.radius
    };
    if (this.coordinates.length > 0) {
      result.coordinates = this.coordinates;
    }
    if (includeTrackUuid) {
      result.trackUuid = this.trackUuid;
    }
    return result;
  }
}
