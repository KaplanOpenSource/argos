import { useCallback } from "react";

export const useTrialGeoJson = () => {
    const downloadGeojson = useCallback((data, experiment, trialType) => {
        const devicesOnTrial = [...(data.devicesOnTrial || [])].filter(d => {
            return d.location && d.location.coordinates && d.location.coordinates.length === 2;
        });

        const json = {
            type: 'FeatureCollection',
            features: devicesOnTrial.map(d => {
                const coordinates = d.location.coordinates.slice().reverse();
                const properties = {
                    name: d.deviceItemName,
                    type: d.deviceTypeName,
                    MapName: d.location.name || RealMapName,
                };
                for (const { name, value } of d.attributes || []) {
                    properties[name] = value;
                }
                return {
                    type: 'Feature',
                    geometry: {
                        type: 'Point',
                        coordinates,
                    },
                    properties
                }
            })
        };
        const filename = `trial_${experiment.name}_${trialType.name}_${data.name}.geojson`;
        const blob = new Blob([JSON.stringify(json, null, 2)], { type: 'application/json' })
        saveAs(blob, filename);
    }, []);

    return {
        downloadGeojson,
    }
}