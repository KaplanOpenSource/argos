import { ScopeEnum } from './ScopeEnum';
import { ValueTypeEnum } from './ValueTypeEnum';

export type ICoordinates = [number, number];
export type ITrackUuid = { trackUuid?: string };

export interface INamed extends ITrackUuid {
  name?: string;
};

export interface IImage extends INamed {
  filename?: string;
  height?: number;
  width?: number;
  gridDelta?: number;
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

export interface ILocation {
  name?: string;
  coordinates?: ICoordinates;
};

export interface IDeviceTypeAndItem extends ITrackUuid {
  deviceTypeName: string;
  deviceItemName: string;
}

export interface IAttribute extends INamed {
  value?: any;
}

// $$$$ TODO:
// 1. on each Obj class derived from IHasAttributes implement get / set attr
// 2. substitute AttributeValueGet with methods to(1)
// 3. use in AttributeItemList(2)
// 4. use the above in DeviceItem
// 5. when some of the attrs are trial specific put on DeviceItem subtrees for each trial

export interface IHasAttributes {
  attributes?: Array<IAttribute>;
}

export interface IDeviceOnTrial extends IDeviceTypeAndItem, IHasAttributes {
  location?: ILocation;
  containedIn?: IDeviceTypeAndItem
};

export interface ITrial extends INamed, IHasAttributes {
  createdDate?: string;
  devicesOnTrial?: Array<IDeviceOnTrial>
  description?: string;
}

export interface IDevice extends INamed, IHasAttributes {
}

export interface IShape extends INamed {
  coordinates?: Array<ICoordinates>;
  center?: ICoordinates;
  radius?: number;
};

export interface ITrialType extends INamed {
  trials?: Array<ITrial>;
  attributeTypes?: Array<IAttributeType>;
};

export interface ISelectOption extends INamed {
};

export interface IAttributeType extends INamed {
  type?: ValueTypeEnum;
  scope?: ScopeEnum;
  multiple?: boolean;
  required?: boolean;
  defaultValue?: any;
  description?: string;
  options?: Array<ISelectOption>;
};

export interface IDeviceType extends INamed {
  devices?: Array<IDevice>;
  attributeTypes?: Array<IAttributeType>;
  icon?: string;
};

export interface IExperiment extends INamed {
  version?: string;
  startDate?: string;
  endDate?: string;
  description?: string;
  imageEmbedded?: Array<IImageEmbedded>;
  imageStandalone?: Array<IImageStandalone>;
  trialTypes?: Array<ITrialType>;
  deviceTypes?: Array<IDeviceType>;
  shapes?: Array<IShape>;
};
