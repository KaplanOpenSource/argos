export type ICoordinates = [number, number];

export interface IImage {
    name?: string;
    filename?: string;
    height?: number;
    width?: number;
};

export interface IImageStandalone extends IImage {
    xleft?: number;
    ybottom?: number;
    xright?: number;
    ytop?: number;
};

export interface IImageEmbedded extends IImage {
    latsouth?: number;
    lngwest?: number;
    latnorth?: number;
    lngeast?: number;
};

export interface IDeviceOnTrial {
    deviceTypeName?: string;
    deviceItemName?: string;
    location?: {
        name?: string;
        coordinates?: ICoordinates
    };
    attributes?: Array<IAttribute>;
};

export interface ITrial {
    name?: string;
    createdDate?: string;
    devicesOnTrial?: Array<IDeviceOnTrial>
    attributes?: Array<IAttribute>;
    description?: string;
}

export interface IAttribute {
    name?: string;
    value?: any;
}

export interface IDevice {
    name?: string;
    attributes?: Array<IAttribute>;
}

export interface IShape {
    name?: string;
    coordinates?: Array<ICoordinates>;
    center?: ICoordinates;
    radius?: number;
};

export interface ITrialType {
    name?: string;
    trials?: Array<ITrial>;
    attributeTypes?: Array<IAttributeType>;
};

export interface ISelectOption {
    name?: string;
};

export interface IAttributeType {
    name?: string;
    type?: string;
    scope?: string;
    multiple?: boolean;
    defaultValue?: any;
    options?: Array<ISelectOption>;
};

export interface IDeviceType {
    name?: string;
    devices?: Array<IDevice>;
    attributeTypes?: Array<IAttributeType>;
};

export interface IExperiment {
    version?: string;
    name?: string;
    startDate?: string;
    endDate?: string;
    description?: string;
    imageEmbedded?: Array<IImageEmbedded>;
    imageStandalone?: Array<IImageStandalone>;
    trialTypes?: Array<ITrialType>;
    deviceTypes?: Array<IDeviceType>;
    shapes?: Array<IShape>;
};
