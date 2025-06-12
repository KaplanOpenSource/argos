import { RealMapName } from '../constants/constants';
import { ICoordinates, IImageStandalone, ILocation } from '../types/types';

export class LocationObj implements ILocation {
  coordinates?: ICoordinates;

  constructor(
    data: ILocation,
    private imageStandalone?: IImageStandalone | undefined,
  ) {
    this.coordinates = data.coordinates;
  }

  get name(): string {
    return this.imageStandalone?.name || RealMapName;
  }

  toJson(_includeTrackUuid: boolean = false): ILocation {
    const result: ILocation = {
      name: this.name,
      coordinates: this.coordinates
    };
    return result;
  }
}
