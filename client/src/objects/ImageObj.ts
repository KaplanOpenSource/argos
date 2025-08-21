import { IImage } from '../types/types';

export class ImageObj implements IImage {
  name: string;
  filename?: string;
  height?: number;
  width?: number;
  gridDelta?: number;

  constructor(data: IImage) {
    if (!data.name) {
      throw new Error('Image name is required');
    }
    this.name = data.name;
    this.filename = data.filename;
    this.height = data.height;
    this.width = data.width;
    this.gridDelta = data.gridDelta;
  }

  toJson(includeTrackUuid: boolean = false): IImage {
    const result: IImage = {
      name: this.name,
      filename: this.filename,
      height: this.height,
      width: this.width,
      gridDelta: this.gridDelta
    };
    return result;
  }
}
