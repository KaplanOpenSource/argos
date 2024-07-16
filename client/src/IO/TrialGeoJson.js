import { useCallback } from "react";
import { AttributeValueGet } from "../Experiment/AttributeValueGet";
import { SCOPE_TRIAL } from "../Experiment/AttributeType";
import { SaveJson } from "./SaveFile";

export const useTrialGeoJson = () => {
    const obtainDevices = useCallback((experiment, trial) => {
        const ret = [];
        for (const d of (trial.devicesOnTrial || [])) {
            if (d.location && d.location.coordinates && d.location.coordinates.length === 2) {
                const coordinates = d.location.coordinates.slice().reverse();
                const properties = {
                    name: d.deviceItemName,
                    type: d.deviceTypeName,
                    MapName: d.location.name || RealMapName,
                };

                const deviceType = experiment?.deviceTypes?.find(x => x.name === d.deviceTypeName);
                const deviceItem = deviceType?.devices?.find(x => x.name === d.deviceItemName);

                if (deviceItem) {
                    deviceType?.attributeTypes?.forEach(attrType => {
                        const {
                            value,
                        } = AttributeValueGet({ attrType, data: d, deviceItem, scope: SCOPE_TRIAL });

                        properties[attrType.name] = value;
                    });

                    ret.push({ coordinates, properties });
                }
            }
        }
        return ret;
    }, []);

    const downloadGeojson = useCallback((experiment, trialType, trial) => {
        const devices = obtainDevices(experiment, trial);
        const json = {
            type: 'FeatureCollection',
            features: devices.map(({ properties, coordinates }) => {
                return {
                    type: 'Feature',
                    geometry: {
                        type: 'Point',
                        coordinates,
                    },
                    properties,
                };
            }),
        }

        SaveJson(json, `trial_${experiment.name}_${trialType.name}_${trial.name}.geojson`);
    }, []);

    return {
        downloadGeojson,
    }
}