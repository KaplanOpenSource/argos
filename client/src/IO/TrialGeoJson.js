import { useCallback } from "react";
import { AttributeValueGet } from "../Experiment/AttributeValueGet";
import { SCOPE_TRIAL } from "../Experiment/AttributeType";

export const useTrialGeoJson = () => {
    const downloadGeojson = useCallback((data, experiment, trialType) => {
        const json = {
            type: 'FeatureCollection',
            features: [],
        };

        for (const d of (data.devicesOnTrial || [])) {
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

                    json.features.push({
                        type: 'Feature',
                        geometry: {
                            type: 'Point',
                            coordinates,
                        },
                        properties
                    });
                }
            }
        }

        const filename = `trial_${experiment.name}_${trialType.name}_${data.name}.geojson`;
        const blob = new Blob([JSON.stringify(json, null, 2)], { type: 'application/json' })
        saveAs(blob, filename);
    }, []);

    return {
        downloadGeojson,
    }
}