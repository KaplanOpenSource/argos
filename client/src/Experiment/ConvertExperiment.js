import { argosJsonVersion } from "../constants/constants";

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
    return {
        name: oldTrialType.name,
        trials,
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
    return {
        name: oldDeviceType.name,
        devices,
    }
}

const convertDevice = (oldDevice, oldDeviceType, oldExp) => {
    return {
        name: oldDevice.name,
    }
}

