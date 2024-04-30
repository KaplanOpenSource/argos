import { argosJsonVersion } from "../constants/constants";

export const ConvertExperiment = (oldExp) => {
    const version = (oldExp || {}).version;
    if (!version.startsWith('2.0.0')) {
        alert(`unknown version ${version}`);
        return undefined;
    }
    console.log('version 2:', oldExp)
    const top = oldExp.experiment;
    const trialTypes = oldExp.trialSets.map(t => convertTrialType(t, oldExp));
    const deviceTypes = oldExp.entityTypes.map(t => convertDeviceType(t, oldExp));
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
    const trials = oldExp.trials
        .filter(r => r.trialSetKey === oldTrialType.key)
        .map(r => convertTrial(r, oldTrialType, oldExp));
    return {
        name: oldTrialType.name,
        trials,
    }
}

const convertTrial = (oldTrial, oldTrialType, oldExp) => {
    return {
        name: oldTrial.name,
    }
}

const convertDeviceType = (oldDeviceType, oldExp) => {
    const devices = oldExp.entities
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

