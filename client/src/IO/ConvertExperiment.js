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

const getOldTrials = (oldExp, oldTrialType) => {
    if (oldExp.trials) {
        return oldExp.trials.filter(r => r.trialSetKey === oldTrialType.key);
    } else {
        return oldTrialType.trials || [];
    }
}

const convertTrialType = (oldTrialType, oldExp) => {
    const oldTrials = getOldTrials(oldExp, oldTrialType);
    const trials = oldTrials.map(r => convertTrial(r, oldTrialType, oldExp));
    const attributeTypes = (oldTrialType.properties || [])
        .map(r => convertAttrType(r));
    return {
        name: oldTrialType.name,
        trials,
        attributeTypes,
    }
}

const convertTrial = (oldTrial, oldTrialType, oldExp) => {
    const devicesOnTrial = (oldTrial.entities || [])
        .map(e => convertDeviceOnTrial(e, oldTrial, oldTrialType, oldExp))
        .filter(x => x);
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
    if (!oldDeviceType) {
        return undefined;
    }
    const oldDeviceItem = getOldDevices(oldExp, oldDeviceType).find(ei => ei.key === oldDeviceOnTrial.key);
    if (!oldDeviceItem) {
        return undefined;
    }
    const locationType = (oldDeviceType.properties || []).find(p => p.type === 'location');
    if (!locationType) {
        return undefined;
    }
    const locationItem = (oldDeviceOnTrial.properties || []).find(p => p.key === locationType.key);
    if (!locationItem) {
        return undefined;
    }

    let location;
    try {
        location = JSON.parse(locationItem.val);
    } catch (_) {
        return undefined;
    }
    if (!location || !location.name || !location.coordinates || location.coordinates.length !== 2) {
        return undefined;
    }

    const attributes = ((oldDeviceOnTrial || {}).properties || [])
        .filter(x => x.key !== locationType.key)
        .map(x => convertAttrValue(x, oldDeviceType))
        .filter(x => x);

    return {
        deviceTypeName: oldDeviceType.name,
        deviceItemName: oldDeviceItem.name,
        location,
        attributes,
    }
}

const getOldDevices = (oldExp, oldDeviceType) => {
    if (oldExp.entities) {
        return oldExp.entities.filter(r => r.entitiesTypeKey === oldDeviceType.key);
    } else {
        return oldDeviceType.entities || [];
    }
}

const convertDeviceType = (oldDeviceType, oldExp) => {
    const devices = getOldDevices(oldExp, oldDeviceType)
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
    const ret = {
        name: oldAttrType.label,
        required: oldAttrType.required,
        defaultValue: oldAttrType.defaultValue,
        type: convertTypeOnAttrType(oldAttrType.type),
    };
    if (ret.type === VALUE_TYPE_SELECT) {
        ret.options = (oldAttrType.value || '').split(',').map(name => {
            return { name };
        });
    }
    return ret;
}

const convertAttrValue = (oldAttrValue, parentTypeHolder) => {
    let { key, val } = oldAttrValue;
    if (val === null || val === undefined) {
        return undefined;
    }
    const oldAttrType = ((parentTypeHolder || {}).properties || []).find(x => x.key === key);
    if (!oldAttrType) {
        return undefined;
    }
    const newType = convertTypeOnAttrType(oldAttrType.type);
    if (newType === VALUE_TYPE_BOOLEAN) {
        val = (!val || val === 'false' || val === '0') ? false : true;
    }
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
