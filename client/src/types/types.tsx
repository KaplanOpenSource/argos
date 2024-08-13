export interface IImageEmbedded {
    latsouth?: number;
    lngwest?: number;
    latnorth?: number;
    lngeast?: number;
};

export type ICoordinates = [number, number];

export interface IDeviceOnTrial {
    location?: {
        name?: string;
        coordinates?: ICoordinates
    };
};

export interface ITrial {
    devicesOnTrial?: Array<IDeviceOnTrial>
}

export interface IShape {
    coordinates?: Array<ICoordinates>;
    center?: ICoordinates;
    radius?: number;
}

export interface IExperiment {
    imageEmbedded?: Array<IImageEmbedded>;
    trialTypes?: Array<{ trials?: Array<ITrial> }>;
    shapes?: Array<IShape>;
};

