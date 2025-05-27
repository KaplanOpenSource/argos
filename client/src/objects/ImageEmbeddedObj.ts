import { IImageEmbedded } from '../types';
import { ImageObj } from '.';

export class ImageEmbeddedObj extends ImageObj implements IImageEmbedded {
    latsouth?: number;
    lngwest?: number;
    latnorth?: number;
    lngeast?: number;

    constructor(data: IImageEmbedded) {
        super(data);
        this.latsouth = data.latsouth;
        this.lngwest = data.lngwest;
        this.latnorth = data.latnorth;
        this.lngeast = data.lngeast;
    }

    toJson(): IImageEmbedded {
        return {
            ...super.toJson(),
            latsouth: this.latsouth,
            lngwest: this.lngwest,
            latnorth: this.latnorth,
            lngeast: this.lngeast
        };
    }
}
