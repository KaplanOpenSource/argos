import { argosJsonVersion } from "../constants/constants";
import { VALUE_TYPE_BOOLEAN, VALUE_TYPE_NUMBER, VALUE_TYPE_SELECT, VALUE_TYPE_STRING } from "./AttributeValue";

export const ConvertExperiment = (oldExp) => {
    const version = (oldExp || {}).version;
    if (!version.startsWith('2.0.0')) {
        alert(`unknown version ${version}`);
        return undefined;
    }
    console.log('version 2:', oldExp)
    const top = oldExp.experiment;
    const trialTypes = (oldExp.trialSets || []).map(t => convertTrialType(t, oldExp));
    const deviceTypes = (oldExp.entityTypes || []).map(t => convertDeviceType(t, oldExp));
    return {
        version: argosJsonVersion,
        name: top.name,
        description: top.description,
        startDate: top.begin,
        endDate: top.end,
        trialTypes,
        deviceTypes,
    };
}

const convertTrialType = (oldTrialType, oldExp) => {
    const trials = (oldExp.trials || [])
        .filter(r => r.trialSetKey === oldTrialType.key)
        .map(r => convertTrial(r, oldTrialType, oldExp));
    const attributeTypes = (oldTrialType.properties || [])
        .map(r => convertAttrType(r, oldDeviceType, oldExp));
    return {
        name: oldTrialType.name,
        trials,
        attributeTypes,
    }
}

const convertTrial = (oldTrial, oldTrialType, oldExp) => {
    const devicesOnTrial = (oldTrial.entities || []).map(e => convertDeviceOnTrial(e, oldTrial, oldTrialType, oldExp));
    return {
        name: oldTrial.name,
        createdDate: oldTrial.created,
        devicesOnTrial,
    }
}

const convertDeviceOnTrial = (oldDeviceOnTrial, oldTrial, oldTrialType, oldExp) => {
    const oldDeviceType = (oldExp.entityTypes || []).find(et => et.key === oldDeviceOnTrial.entitiesTypeKey);
    const oldDeviceItem = (oldExp.entities || []).find(ei => ei.key === oldDeviceOnTrial.key);
    const locationType = (oldDeviceType.properties || []).find(p => p.type === 'location');
    const locationItem = (oldDeviceOnTrial.properties || []).find(p => p.key === locationType.key);
    const location = JSON.parse(locationItem.val);
    return {
        deviceTypeName: oldDeviceType.name,
        deviceItemName: oldDeviceItem.name,
        location,
    }
}

const convertDeviceType = (oldDeviceType, oldExp) => {
    const devices = (oldExp.entities || [])
        .filter(r => r.entitiesTypeKey === oldDeviceType.key)
        .map(r => convertDevice(r, oldDeviceType, oldExp));
    const attributeTypes = (oldDeviceType.properties || [])
        .filter(r => r.type !== 'location')
        .map(r => convertAttrType(r, oldDeviceType, oldExp));
    return {
        name: oldDeviceType.name,
        devices,
        attributeTypes,
    }
}

const convertDevice = (oldDevice, oldDeviceType, oldExp) => {
    return {
        name: oldDevice.name,
    }
}

const convertTypeOnAttrType = (oldType) => {
    switch (oldType) {
        case 'text':
        case 'textArea':
            return VALUE_TYPE_STRING;
        case 'number':
            return VALUE_TYPE_NUMBER;
        case 'boolean':
        case 'bool':
            return VALUE_TYPE_BOOLEAN;
        case 'date':
        case 'time':
        case 'datetime':
        case 'datetime-local':
            return VALUE_TYPE_BOOLEAN;
        case 'selectList':
            return VALUE_TYPE_SELECT;
        default:
            return VALUE_TYPE_STRING;
    }
}

const convertAttrType = (oldAttr, oldDeviceType, oldExp) => {
    return {
        name: oldAttr.label,
        required: oldAttr.required,
        defaultValue: oldAttr.defaultValue,
        type: convertTypeOnAttrType(oldAttr.type),
    }
}
