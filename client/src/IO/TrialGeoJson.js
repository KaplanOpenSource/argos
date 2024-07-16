import { useCallback } from "react";
import { AttributeValueGet } from "../Experiment/AttributeValueGet";
import { SCOPE_TRIAL } from "../Experiment/AttributeType";
import { SaveJson } from "./FileIo";
import JSZip from "jszip";
import { saveAs } from 'file-saver';
import { stringify } from 'csv-stringify/browser/esm/sync';

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

    const downloadZipCsv = useCallback(async (experiment, trialType, trial) => {
        const devices = obtainDevices(experiment, trial);
        const deviceTypes = [...new Set(devices.map(d => d.properties.type))];
        const zip = JSZip();
        for (const deviceTypeName of deviceTypes) {
            const deviceItems = devices.filter(d => d.properties.type === deviceTypeName);

            const firstFields = ['name', 'type', 'MapName', 'Latitude', 'Longitude'];
            const allFields = [...new Set(deviceItems.flatMap(d => {
                return Object.keys(d.properties).filter(f => !firstFields.includes(f));
            }))];
            const fields = firstFields.concat(allFields);

            const lines = [fields];
            for (const dev of deviceItems) {
                const devline = [dev.properties.name, dev.properties.type, dev.properties.MapName, dev.coordinates[0], dev.coordinates[1]];
                for (const field of allFields) {
                    const prop = dev.properties[field];
                    devline.push((!prop && prop !== 0) ? '' : prop);
                }
                lines.push(devline);
            }

            const text = stringify(lines);
            zip.file(`${deviceTypeName}.csv`, text);
        }

        const zipblob = await zip.generateAsync({ type: "blob" });
        saveAs(zipblob, `trial_${experiment.name}_${trialType.name}_${trial.name}.zip`);

    }, []);

    return {
        downloadGeojson,
        downloadZipCsv,
    }
}