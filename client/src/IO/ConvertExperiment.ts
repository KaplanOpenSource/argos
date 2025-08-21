import { argosJsonVersion } from "../constants/constants";
import { IAttribute, IAttributeType, IDevice, IDeviceOnTrial, IDeviceType, IExperiment, IImageStandalone, ITrial, ITrialType } from "../types/types";
import { ValueTypeEnum } from "../types/ValueTypeEnum";

export class ConvertExperiment {
  public readonly errors: Array<string> = [];

  go(oldExp): IExperiment | undefined {
    if (!ConvertExperiment.isExperimentVersion2(oldExp)) {
      this.errors.push(`unknown version ${(oldExp || {}).version || ""}`);
      return undefined;
    }

    const top = (oldExp.experiment || oldExp.experimentsWithData) || {};
    const entitiesTypes = oldExp.entityTypes || oldExp.entitiesTypes || [];
    const trialTypes = (oldExp.trialSets || []).map(t => this.convertTrialType(t, oldExp, entitiesTypes));
    const deviceTypes = entitiesTypes.map(t => this.convertDeviceType(t, oldExp));
    const images = top.maps || [];
    const imageStandalone = images.filter(im => (im || {}).embedded === false).map(im => this.convertImage(im));
    const imageEmbedded = images.filter(im => (im || {}).embedded === true).map(im => this.convertImage(im));

    return {
      version: argosJsonVersion,
      name: top.name,
      description: top.description,
      startDate: top.begin,
      endDate: top.end,
      trialTypes,
      deviceTypes,
      imageEmbedded,
      imageStandalone,
    };
  }

  static isExperimentVersion2(experiment) {
    const exp = experiment || {};
    if ((exp.version || "").startsWith('2.0.0')) {
      return true;
    }
    if (exp.experimentsWithData || exp.trialSets) {
      return true;
    }
    return false;
  }

  getOldTrials(oldExp, oldTrialType) {
    if (oldExp.trials) {
      return oldExp.trials.filter(r => r.trialSetKey === oldTrialType.key);
    } else {
      return oldTrialType.trials || [];
    }
  }

  convertTrialType(oldTrialType, oldExp, entitiesTypes: any[]): ITrialType {
    const oldTrials = this.getOldTrials(oldExp, oldTrialType);
    const trials = oldTrials.map(r => this.convertTrial(r, oldTrialType, oldExp, entitiesTypes));
    const attributeTypes = (oldTrialType.properties || [])
      .map(r => this.convertAttrType(r));
    return {
      name: oldTrialType.name,
      trials,
      attributeTypes,
    }
  }

  convertTrial(oldTrial, oldTrialType, oldExp, entitiesTypes: any[]): ITrial {
    const devicesOnTrial = (oldTrial.entities || [])
      .map(e => this.convertDeviceOnTrial(e, oldTrial, oldTrialType, oldExp, entitiesTypes))
      .filter(x => x);
    const attributes = ((oldTrial || {}).properties || [])
      .map(x => this.convertAttrValue(x, oldTrialType))
      .filter(x => x);
    return {
      name: oldTrial.name,
      createdDate: oldTrial.created,
      devicesOnTrial,
      attributes,
    }
  }

  convertDeviceOnTrial(oldDeviceOnTrial, oldTrial, oldTrialType, oldExp, entitiesTypes: any[]): IDeviceOnTrial | undefined {
    const oldDeviceType = entitiesTypes.find(et => et.key === oldDeviceOnTrial.entitiesTypeKey);
    if (!oldDeviceType) {
      this.errors.push(`cannot find old entity type with key ${oldDeviceOnTrial.entitiesTypeKey} on trial ${oldTrial.name}`);
      return undefined;
    }
    const oldDeviceItem = this.getOldDevices(oldExp, oldDeviceType).find(ei => ei.key === oldDeviceOnTrial.key);
    if (!oldDeviceItem) {
      this.errors.push(`cannot find old entity with key ${oldDeviceOnTrial.key} for ${oldDeviceType.name} on trial ${oldTrial.name}`);
      return undefined;
    }
    const locationType = (oldDeviceType.properties || []).find(p => p.type === 'location');
    if (!locationType) {
      this.errors.push(`cannot find location type for entity type ${oldDeviceType.name} on trial ${oldTrial.name}`);
      return undefined;
    }
    const locationItem = (oldDeviceOnTrial.properties || []).find(p => p.key === locationType.key);
    if (!locationItem) {
      this.errors.push(`cannot find location for  entity ${oldDeviceItem.name} of type ${oldDeviceType.name} on trial ${oldTrial.name} (${oldDeviceOnTrial.key})`);
      return undefined;
    }

    let location;
    try {
      location = JSON.parse(locationItem.val);
    } catch (_) {
      this.errors.push(`cannot parse location for entity ${oldDeviceItem.name} of type ${oldDeviceType.name} on trial ${oldTrial.name} (${oldDeviceOnTrial.key}), got: ${locationItem.val}`);
      return undefined;
    }
    if (!location || !location.name || !location.coordinates || location.coordinates.length !== 2) {
      this.errors.push(`invalid location for entity ${oldDeviceItem.name} of type ${oldDeviceType.name} on trial ${oldTrial.name} (${oldDeviceOnTrial.key}), got: ${locationItem.val}`);
      return undefined;
    }

    const attributes = ((oldDeviceOnTrial || {}).properties || [])
      .filter(x => x.key !== locationType.key)
      .map(x => this.convertAttrValue(x, oldDeviceType))
      .filter(x => x);

    return {
      deviceTypeName: oldDeviceType.name,
      deviceItemName: oldDeviceItem.name,
      location,
      attributes,
    }
  }

  getOldDevices(oldExp, oldDeviceType) {
    if (oldExp.entities) {
      return oldExp.entities.filter(r => r.entitiesTypeKey === oldDeviceType.key);
    } else {
      return oldDeviceType.entities || [];
    }
  }

  convertDeviceType(oldDeviceType, oldExp): IDeviceType {
    const devices = this.getOldDevices(oldExp, oldDeviceType)
      .map(r => this.convertDevice(r, oldDeviceType, oldExp));
    const attributeTypes = (oldDeviceType.properties || [])
      .filter(r => r.type !== 'location')
      .map(r => this.convertAttrType(r));
    return {
      name: oldDeviceType.name,
      devices,
      attributeTypes,
    }
  }

  convertDevice(oldDevice, oldDeviceType, oldExp): IDevice {
    const attributes = ((oldDevice || {}).properties || [])
      .map(x => this.convertAttrValue(x, oldDeviceType))
      .filter(x => x);
    return {
      name: oldDevice.name,
      attributes,
    }
  }

  convertTypeOnAttrType(oldType) {
    switch (oldType) {
      case 'text':
      case 'textArea':
        return ValueTypeEnum.VALUE_TYPE_STRING;
      case 'number':
        return ValueTypeEnum.VALUE_TYPE_NUMBER;
      case 'boolean':
      case 'bool':
        return ValueTypeEnum.VALUE_TYPE_BOOLEAN;
      case 'date':
      case 'time':
      case 'datetime':
      case 'datetime-local':
        return ValueTypeEnum.VALUE_TYPE_DATE_TIME;
      case 'selectList':
        return ValueTypeEnum.VALUE_TYPE_SELECT;
      default:
        return ValueTypeEnum.VALUE_TYPE_STRING;
    }
  }

  convertAttrType(oldAttrType): IAttributeType {
    const ret: IAttributeType = {
      name: oldAttrType.label,
      required: oldAttrType.required,
      defaultValue: oldAttrType.defaultValue,
      type: this.convertTypeOnAttrType(oldAttrType.type),
    };
    if (ret.type === ValueTypeEnum.VALUE_TYPE_SELECT) {
      ret.options = (oldAttrType.value || '').split(',').map(name => {
        return { name };
      });
    }
    return ret;
  }

  convertAttrValue(oldAttrValue, parentTypeHolder): IAttribute | undefined {
    let { key, val } = oldAttrValue;
    if (val === null || val === undefined) {
      return undefined;
    }
    const oldAttrType = ((parentTypeHolder || {}).properties || []).find(x => x.key === key);
    if (!oldAttrType) {
      this.errors.push(`cannot find attribute type for attribute with key ${key}, had value ${val}`);
      return undefined;
    }
    const newType = this.convertTypeOnAttrType(oldAttrType.type);
    if (newType === ValueTypeEnum.VALUE_TYPE_BOOLEAN) {
      val = (!val || val === 'false' || val === '0') ? false : true;
    }
    return {
      name: oldAttrType.label,
      value: val,
    }
  }

  convertImage(oldImage): IImageStandalone {
    const {
      imageName,
      lower,
      upper,
      left,
      right,
    } = oldImage;
    return {
      name: imageName,
      xleft: left,
      ybottom: lower,
      xright: right,
      ytop: upper,
    }
  }
};