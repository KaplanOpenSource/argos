import { v4 as uuidv4 } from 'uuid';
import { ImageObj } from '.';
import { IImageStandalone } from '../types/types';

export class ImageStandaloneObj extends ImageObj implements IImageStandalone {
  xleft?: number;
  ybottom?: number;
  xright?: number;
  ytop?: number;
  trackUuid: string;

  constructor(data: IImageStandalone) {
    super(data);
    this.xleft = data.xleft;
    this.ybottom = data.ybottom;
    this.xright = data.xright;
    this.ytop = data.ytop;
    this.trackUuid = data.trackUuid || uuidv4();
  }

  toJson(includeTrackUuid: boolean = false): IImageStandalone {
    const result: IImageStandalone = {
      ...super.toJson(includeTrackUuid),
      xleft: this.xleft,
      ybottom: this.ybottom,
      xright: this.xright,
      ytop: this.ytop
    };
    if (includeTrackUuid) {
      result.trackUuid = this.trackUuid;
    }
    return result;
  }
}
