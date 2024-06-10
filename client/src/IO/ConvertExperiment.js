import { argosJsonVersion } from "../constants/constants";
import { VALUE_TYPE_BOOLEAN, VALUE_TYPE_NUMBER, VALUE_TYPE_SELECT, VALUE_TYPE_STRING } from "../Experiment/AttributeValue";

export const isExperimentVersion2 = (experiment) => {
    const exp = experiment || {};
    if ((exp.version || "").startsWith('2.0.0')) {
        return true;
    }
    if (exp.experimentsWithData || exp.trialSets) {
        return true;
    }
    return false;
}

export const ConvertExperiment = (oldExp) => {
    if (!isExperimentVersion2(oldExp)) {
        alert(`unknown version ${(oldExp || {}).version || ""}`);
        return undefined;
    }
    // console.log('version 2:', oldExp)
    const top = (oldExp.experiment || oldExp.experimentsWithData) || {};
    const trialTypes = (oldExp.trialSets || []).map(t => convertTrialType(t, oldExp));
    const deviceTypes = (oldExp.entityTypes || []).map(t => convertDeviceType(t, oldExp));
    const images = top.maps || [];
    const imageStandalone = images.filter(im => (im || {}).embedded === false).map(im => convertImage(im));
    const imageEmbedded = images.filter(im => (im || {}).embedded === true).map(im => convertImage(im));
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

const convertTrialType = (oldTrialType, oldExp) => {
    const trials = (oldExp.trials || [])
        .filter(r => r.trialSetKey === oldTrialType.key)
        .map(r => convertTrial(r, oldTrialType, oldExp));
    const attributeTypes = (oldTrialType.properties || [])
        .map(r => convertAttrType(r));
    return {
        name: oldTrialType.name,
        trials,
        attributeTypes,
    }
}

const convertTrial = (oldTrial, oldTrialType, oldExp) => {
    const devicesOnTrial = (oldTrial.entities || []).map(e => convertDeviceOnTrial(e, oldTrial, oldTrialType, oldExp));
    const attributes = ((oldTrial || {}).properties || [])
        .map(x => convertAttrValue(x, oldTrialType))
        .filter(x => x);
    return {
        name: oldTrial.name,
        createdDate: oldTrial.created,
        devicesOnTrial,
        attributes,
    }
}

const convertDeviceOnTrial = (oldDeviceOnTrial, oldTrial, oldTrialType, oldExp) => {
    const oldDeviceType = (oldExp.entityTypes || []).find(et => et.key === oldDeviceOnTrial.entitiesTypeKey);
    const oldDeviceItem = (oldExp.entities || []).find(ei => ei.key === oldDeviceOnTrial.key);
    const locationType = (oldDeviceType.properties || []).find(p => p.type === 'location');
    const locationItem = (oldDeviceOnTrial.properties || []).find(p => p.key === locationType.key);
    const location = JSON.parse(locationItem.val);
    const attributes = ((oldDeviceOnTrial || {}).properties || [])
        .map(x => convertAttrValue(x, oldDeviceType))
        .filter(x => x);
    return {
        deviceTypeName: oldDeviceType.name,
        deviceItemName: oldDeviceItem.name,
        location,
        attributes,
    }
}

const convertDeviceType = (oldDeviceType, oldExp) => {
    const devices = (oldExp.entities || [])
        .filter(r => r.entitiesTypeKey === oldDeviceType.key)
        .map(r => convertDevice(r, oldDeviceType, oldExp));
    const attributeTypes = (oldDeviceType.properties || [])
        .filter(r => r.type !== 'location')
        .map(r => convertAttrType(r));
    return {
        name: oldDeviceType.name,
        devices,
        attributeTypes,
    }
}

const convertDevice = (oldDevice, oldDeviceType, oldExp) => {
    const attributes = ((oldDevice || {}).properties || [])
        .map(x => convertAttrValue(x, oldDeviceType))
        .filter(x => x);
    return {
        name: oldDevice.name,
        attributes,
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

const convertAttrType = (oldAttrType) => {
    return {
        name: oldAttrType.label,
        required: oldAttrType.required,
        defaultValue: oldAttrType.defaultValue,
        type: convertTypeOnAttrType(oldAttrType.type),
    }
}

const convertAttrValue = (oldAttrValue, parentTypeHolder) => {
    const { key, val } = oldAttrValue;
    if (val !== null && val !== undefined) {
        return undefined;
    }
    const oldAttrType = ((parentTypeHolder || {}).properties || []).find(x => x.key === key);
    return {
        name: oldAttrType.label,
        value: val,
    }
}

const convertImage = (oldImage) => {
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
