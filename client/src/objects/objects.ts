import { RealMapName } from '../constants/constants';
import {
  IAttribute,
  IAttributeType,
  ICoordinates,
  IDevice,
  IDeviceOnTrial,
  IDeviceType,
  IDeviceTypeAndItem,
  IExperiment,
  IImage,
  IImageEmbedded, IImageStandalone,
  ILocation,
  ISelectOption,
  IShape,
  ITrial,
  ITrialType,
  ScopeEnum
} from '../types/types';
import { ExperimentChange } from './ExperimentChange';

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

export class ImageStandaloneObj extends ImageObj implements IImageStandalone {
  xleft?: number;
  ybottom?: number;
  xright?: number;
  ytop?: number;

  constructor(data: IImageStandalone) {
    super(data);
    this.xleft = data.xleft;
    this.ybottom = data.ybottom;
    this.xright = data.xright;
    this.ytop = data.ytop;
  }

  toJson(): IImageStandalone {
    return {
      ...super.toJson(),
      xleft: this.xleft,
      ybottom: this.ybottom,
      xright: this.xright,
      ytop: this.ytop
    };
  }
}

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

export class LocationObj implements ILocation {
  name: string;
  coordinates?: ICoordinates;

  constructor(data: ILocation) {
    this.name = data.name || RealMapName;
    this.coordinates = data.coordinates;
  }

  toJson(): ILocation {
    return {
      name: this.name,
      coordinates: this.coordinates
    };
  }
}

export class AttributeObj implements IAttribute {
  name: string;
  value?: any;

  constructor(data: IAttribute) {
    if (!data.name) {
      throw new Error('Attribute name is required');
    }
    this.name = data.name;
    this.value = data.value;
  }

  toJson(): IAttribute {
    return {
      name: this.name,
      value: this.value
    };
  }
}

export class DeviceOnTrialObj implements IDeviceOnTrial {
  readonly deviceItem: DeviceItemObj;
  readonly trial: TrialObj;
  location?: LocationObj;
  attributes: AttributeObj[] = [];
  containedIn?: DeviceOnTrialObj;

  constructor(data: IDeviceOnTrial, deviceItem: DeviceItemObj, trial: TrialObj) {
    this.deviceItem = deviceItem;
    this.trial = trial;
    this.location = data.location ? new LocationObj(data.location) : undefined;
    this.attributes = data.attributes?.map(attr => new AttributeObj(attr)) || [];
  }

  setContainedIn(containedIn?: IDeviceTypeAndItem) {
    this.containedIn = this.trial?.devicesOnTrial?.find(d =>
      d.deviceTypeName === containedIn?.deviceTypeName &&
      d.deviceItemName === containedIn?.deviceItemName
    );
  }

  get deviceTypeName(): string {
    return this.deviceItem.deviceType.name;
  }

  get deviceItemName(): string {
    return this.deviceItem.name;
  }

  toJson(): IDeviceOnTrial {
    const result: IDeviceOnTrial = {
      deviceTypeName: this.deviceTypeName,
      deviceItemName: this.deviceItemName,
      location: this.location?.toJson()
    };
    if (this.containedIn) {
      result.containedIn = {
        deviceTypeName: this.containedIn.deviceTypeName,
        deviceItemName: this.containedIn.deviceItemName
      };
    }
    if (this.attributes.length > 0) {
      result.attributes = this.attributes.map(attr => attr.toJson());
    }
    return result;
  }
}

export class TrialObj implements ITrial {
  name: string;
  createdDate?: string;
  private _devicesOnTrial: DeviceOnTrialObj[] = [];
  description?: string;
  attributes: AttributeObj[] = [];
  private readonly deviceTypes: DeviceTypeObj[];

  constructor(data: ITrial, deviceTypes: DeviceTypeObj[]) {
    if (!data.name) {
      throw new Error('Trial name is required');
    }
    this.name = data.name;
    this.createdDate = data.createdDate;
    this.deviceTypes = deviceTypes;

    // First create all devices
    this._devicesOnTrial = data.devicesOnTrial?.map(device => {
      const deviceType = deviceTypes.find(dt => dt.name === device.deviceTypeName);
      if (!deviceType) {
        throw new Error(`Device type ${device.deviceTypeName} not found`);
      }
      const deviceItem = deviceType.devices.find(d => d.name === device.deviceItemName);
      if (!deviceItem) {
        throw new Error(`Device item ${device.deviceItemName} not found in type ${device.deviceTypeName}`);
      }
      return new DeviceOnTrialObj(device, deviceItem, this);
    }) || [];

    // Then set up containedIn relationships
    for (let i = 0; i < this._devicesOnTrial.length; i++) {
      this._devicesOnTrial[i].setContainedIn(data.devicesOnTrial?.[i].containedIn);
    }

    this.description = data.description;
    this.attributes = data.attributes?.map(attr => new AttributeObj(attr)) || [];
  }

  private filterValidDevices(devices: DeviceOnTrialObj[]): DeviceOnTrialObj[] {
    return devices.filter(device => {
      const deviceType = device.deviceItem.deviceType;
      // Check if device type exists and is still in the experiment's deviceTypes list
      return deviceType && device.deviceItem &&
        deviceType.devices.includes(device.deviceItem) &&
        this.deviceTypes.includes(deviceType);
    });
  }

  get devicesOnTrial(): DeviceOnTrialObj[] {
    return this.filterValidDevices(this._devicesOnTrial);
  }

  set devicesOnTrial(devices: DeviceOnTrialObj[]) {
    this._devicesOnTrial = this.filterValidDevices(devices);
  }

  toJson(): ITrial {
    const result: ITrial = {
      name: this.name,
      createdDate: this.createdDate,
      description: this.description
    };
    if (this.devicesOnTrial.length > 0) {
      result.devicesOnTrial = this.devicesOnTrial.map(device => device.toJson());
    }
    if (this.attributes.length > 0) {
      result.attributes = this.attributes.map(attr => attr.toJson());
    }
    return result;
  }
}

export class DeviceItemObj implements IDevice {
  readonly deviceType: DeviceTypeObj;
  name: string;
  attributes: AttributeObj[] = [];

  constructor(data: IDevice, deviceType: DeviceTypeObj) {
    if (!data.name) {
      throw new Error('Device name is required');
    }
    this.deviceType = deviceType;
    this.name = data.name;
    this.attributes = data.attributes?.map(attr => new AttributeObj(attr)) || [];
  }

  toJson(): IDevice {
    const result: IDevice = {
      name: this.name
    };
    if (this.attributes.length > 0) {
      result.attributes = this.attributes.map(attr => attr.toJson());
    }
    return result;
  }
}

export class ShapeObj implements IShape {
  name: string;
  coordinates: ICoordinates[] = [];
  center?: ICoordinates;
  radius?: number;

  constructor(data: IShape) {
    if (!data.name) {
      throw new Error('Shape name is required');
    }
    this.name = data.name;
    this.coordinates = data.coordinates || [];
    this.center = data.center;
    this.radius = data.radius;
  }

  toJson(): IShape {
    const result: IShape = {
      name: this.name,
      center: this.center,
      radius: this.radius
    };
    if (this.coordinates.length > 0) {
      result.coordinates = this.coordinates;
    }
    return result;
  }
}

export class AttributeTypeObj implements IAttributeType {
  name: string;
  type?: string;
  scope?: ScopeEnum;
  multiple?: boolean;
  required?: boolean;
  defaultValue?: any;
  description?: string;
  options: ISelectOption[] = [];

  constructor(data: IAttributeType) {
    if (!data.name) {
      throw new Error('AttributeType name is required');
    }
    this.name = data.name;
    this.type = data.type;
    this.scope = data.scope;
    this.multiple = data.multiple;
    this.required = data.required;
    this.defaultValue = data.defaultValue;
    this.description = data.description;
    this.options = data.options || [];
  }

  toJson(): IAttributeType {
    const result: IAttributeType = {
      name: this.name,
      type: this.type,
      scope: this.scope,
      multiple: this.multiple,
      required: this.required,
      defaultValue: this.defaultValue,
      description: this.description
    };
    if (this.options.length > 0) {
      result.options = this.options;
    }
    return result;
  }
}

export class DeviceTypeObj implements IDeviceType {
  name: string;
  devices: DeviceItemObj[] = [];
  attributeTypes: AttributeTypeObj[] = [];

  constructor(data: IDeviceType) {
    if (!data.name) {
      throw new Error('DeviceType name is required');
    }
    this.name = data.name;
    this.devices = data.devices?.map(device => new DeviceItemObj(device, this)) || [];
    this.attributeTypes = data.attributeTypes?.map(attr => new AttributeTypeObj(attr)) || [];
  }

  toJson(): IDeviceType {
    const result: IDeviceType = {
      name: this.name
    };
    if (this.devices.length > 0) {
      result.devices = this.devices.map(device => device.toJson());
    }
    if (this.attributeTypes.length > 0) {
      result.attributeTypes = this.attributeTypes.map(attr => attr.toJson());
    }
    return result;
  }
}

export class TrialTypeObj implements ITrialType {
  name: string;
  trials: TrialObj[] = [];
  attributeTypes: AttributeTypeObj[] = [];

  constructor(data: ITrialType, deviceTypes: DeviceTypeObj[]) {
    if (!data.name) {
      throw new Error('TrialType name is required');
    }
    this.name = data.name;
    this.trials = data.trials?.map(trial => new TrialObj(trial, deviceTypes)) || [];
    this.attributeTypes = data.attributeTypes?.map(attr => new AttributeTypeObj(attr)) || [];
  }

  toJson(): ITrialType {
    const result: ITrialType = {
      name: this.name
    };
    if (this.trials.length > 0) {
      result.trials = this.trials.map(trial => trial.toJson());
    }
    if (this.attributeTypes.length > 0) {
      result.attributeTypes = this.attributeTypes.map(attr => attr.toJson());
    }
    return result;
  }
}

export class ExperimentObj implements IExperiment {
  version?: string;
  startDate?: string;
  endDate?: string;
  description?: string;
  name: string;
  imageEmbedded: ImageEmbeddedObj[] = [];
  imageStandalone: ImageStandaloneObj[] = [];
  trialTypes: TrialTypeObj[] = [];
  deviceTypes: DeviceTypeObj[] = [];
  shapes: ShapeObj[] = [];

  constructor(data: IExperiment) {
    if (!data.name) {
      throw new Error('Experiment name is required');
    }
    this.version = data.version;
    this.startDate = data.startDate;
    this.endDate = data.endDate;
    this.description = data.description;
    this.name = data.name;

    this.imageEmbedded = data.imageEmbedded?.map(img => new ImageEmbeddedObj(img)) || [];
    this.imageStandalone = data.imageStandalone?.map(img => new ImageStandaloneObj(img)) || [];
    this.deviceTypes = data.deviceTypes?.map(type => new DeviceTypeObj(type)) || [];
    this.trialTypes = data.trialTypes?.map(type => new TrialTypeObj(type, this.deviceTypes)) || [];
    this.shapes = data.shapes?.map(shape => new ShapeObj(shape)) || [];
  }

  getTrialTypeCount(): number {
    return this.trialTypes.length;
  }

  getTrialCount(): number {
    return this.trialTypes.reduce((sum, type) => sum + type.trials.length, 0);
  }

  getDeviceCount(): number {
    return this.deviceTypes.reduce((sum, type) => sum + type.devices.length, 0);
  }

  toJson(): IExperiment {
    const result: IExperiment = {
      version: this.version,
      startDate: this.startDate,
      endDate: this.endDate,
      description: this.description,
      name: this.name
    };
    if (this.imageEmbedded.length > 0) {
      result.imageEmbedded = this.imageEmbedded.map(img => img.toJson());
    }
    if (this.imageStandalone.length > 0) {
      result.imageStandalone = this.imageStandalone.map(img => img.toJson());
    }
    if (this.trialTypes.length > 0) {
      result.trialTypes = this.trialTypes.map(type => type.toJson());
    }
    if (this.deviceTypes.length > 0) {
      result.deviceTypes = this.deviceTypes.map(type => type.toJson());
    }
    if (this.shapes.length > 0) {
      result.shapes = this.shapes.map(shape => shape.toJson());
    }
    return result;
  }

  /**
   * Creates a new ExperimentChange instance for this experiment.
   * Use this to create a modified clone of the experiment while maintaining
   * references to specific objects.
   * @returns A new ExperimentChange instance
   */
  createChange(): ExperimentChange {
    return new ExperimentChange(this);
  }
} 