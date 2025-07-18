import { v4 as uuidv4 } from 'uuid';
import { IImageEmbedded } from '../types/types';
import { ImageObj } from './ImageObj';

export class ImageEmbeddedObj extends ImageObj implements IImageEmbedded {
  latsouth?: number;
  lngwest?: number;
  latnorth?: number;
  lngeast?: number;
  trackUuid: string;

  constructor(data: IImageEmbedded) {
    super(data);
    this.latsouth = data.latsouth;
    this.lngwest = data.lngwest;
    this.latnorth = data.latnorth;
    this.lngeast = data.lngeast;
    this.trackUuid = data.trackUuid || uuidv4();
  }

  toJson(includeTrackUuid: boolean = false): IImageEmbedded {
    const result: IImageEmbedded = {
      ...super.toJson(includeTrackUuid),
      latsouth: this.latsouth,
      lngwest: this.lngwest,
      latnorth: this.latnorth,
      lngeast: this.lngeast
    };
    if (includeTrackUuid) {
      result.trackUuid = this.trackUuid;
    }
    return result;
  }
}
