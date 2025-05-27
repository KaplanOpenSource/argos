import { IImage } from '../types';

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

    toJson(): IImage {
        return {
            name: this.name,
            filename: this.filename,
            height: this.height,
            width: this.width,
            gridDelta: this.gridDelta
        };
    }
}
