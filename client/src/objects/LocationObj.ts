import { RealMapName } from '../constants/constants';
import { ICoordinates, ILocation } from '../types/types';

export class LocationObj implements ILocation {
  name: string;
  coordinates?: ICoordinates;

  constructor(data: ILocation) {
    this.name = data.name || RealMapName;
    this.coordinates = data.coordinates;
  }

  toJson(): ILocation {
    return {
      name: this.name,
      coordinates: this.coordinates
    };
  }
}
