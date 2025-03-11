import { IImageStandalone } from "../../types/types";
import { IAnchorPoint } from "./IAnchorPoint";

export type IImageBounds = Required<Omit<IImageStandalone, 'name' | 'filename'>>;

export class ComputedImageData {
    public readonly data: IImageBounds;
    private readonly xspan: number;
    private readonly yspan: number;

    constructor(imageData: IImageStandalone) {
        this.data = {
            xleft: imageData.xleft ?? 0,
            ybottom: imageData.ybottom ?? 0,
            xright: imageData.xright ?? 400,
            ytop: imageData.ytop ?? 300,
            height: imageData.height ?? 300,
            width: imageData.width ?? 400,
        };
        this.xspan = this.data.xright - this.data.xleft;
        this.yspan = this.data.ytop - this.data.ybottom;
    }
    public calcXY = ({ lat, lng }: { lat: number; lng: number; }): IAnchorPoint => {
        return ({ lat, lng, x: this.calcX(lng), y: this.calcY(lat) });
    };
    public calcLatLng = ({ x, y }: { x: number; y: number; }): IAnchorPoint => {
        return { x, y, lat: this.calcLat(y), lng: this.calcLng(x) };
    };
    public calcLat(y: number) {
        return y * this.yspan / this.data.height + this.data.ybottom;
    }
    public calcLng(x: number) {
        return x * this.xspan / this.data.width + this.data.xleft;
    }
    public calcY(lat: number) {
        return (lat - this.data.ybottom) / this.yspan * this.data.height;
    }
    public calcX(lng: number) {
        return (lng - this.data.xleft) / this.xspan * this.data.width;
    }
}

