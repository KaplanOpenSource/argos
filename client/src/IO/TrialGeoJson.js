import { useCallback } from "react";
import { AttributeValueGet } from "../Experiment/AttributeValueGet";
import { SCOPE_TRIAL } from "../Experiment/AttributeType";
import { ReadFileAsText, SaveJson } from "./FileIo";
import JSZip from "jszip";
import { saveAs } from 'file-saver';
import { stringify } from 'csv-stringify/browser/esm/sync';
import { parse } from 'csv-parse/browser/esm/sync';
import { deepClone } from "fast-json-patch";

export const useTrialGeoJson = () => {
    const obtainDevices = useCallback((experiment, trial) => {
        const ret = [];
        for (const d of (trial.devicesOnTrial || [])) {
            if (d.location && d.location.coordinates && d.location.coordinates.length === 2) {
                const coordinates = d.location.coordinates;
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
                        coordinates: coordinates.slice().reverse(), // GeoJson coords are reversed
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

    const uploadTrialFromText = useCallback(async (text, fileExt, trial, experiment, setTrialData) => {
        if (fileExt.endsWith('json')) {
            const json = JSON.parse(text);
            console.log(lines);
        } else if (fileExt === 'csv') {
            const lines = parse(text);
            const objs = lines.slice(1).map(line => {
                return Object.fromEntries(lines[0].map((o, i) => [o, line[i]]));
            });
            const newTrial = deepClone(trial);
            for (const d of objs) {
                const deviceType = experiment?.deviceTypes?.find(x => x.name === d.type);
                const deviceOnTrial = newTrial?.devicesOnTrial?.find(x => x.deviceTypeName === d.type && x.deviceItemName === d.name);
                if (deviceType && deviceOnTrial) {
                    deviceOnTrial.location = {
                        "name": d.MapName,
                        "coordinates": [
                            parseFloat(d.Latitude),
                            parseFloat(d.Longitude),
                        ]
                    }
                    for (const attrType of deviceType.attributeTypes || []) {
                        if (attrType.scope === SCOPE_TRIAL) {
                            const value = d[attrType.name];
                            if (value || value === 0 || value === '') {
                                deviceOnTrial.attributes ||= [];
                                const attr = deviceOnTrial.attributes.find(x => x.name === attrType.name);
                                if (attr) {
                                    attr.value = value;
                                } else {
                                    deviceOnTrial.attributes.push({ name: attrType.name, value });
                                }
                            }
                        }
                    }
                }
            }
            setTrialData(newTrial);
        } else {
            throw "unknown file extension " + fileExt;
        }
    }, []);

    const uploadTrial = useCallback(async (file, trial, experiment, setTrialData) => {
        const ext = file.name.split('.').pop().toLowerCase();
        if (ext === 'json' || ext === 'geojson' || ext === 'csv') {
            const text = await ReadFileAsText(file);
            uploadTrialFromText(text, ext, trial, experiment, setTrialData);
        } else if (ext === 'zip') {
            const zip = await JSZip().loadAsync(file);
            for (const z of Object.values(zip.files)) {
                const zext = z.name.split('.').pop().toLowerCase();
                if (zext === 'json' || zext === 'geojson' || zext === 'csv') {
                    const ztext = await z.async('text');
                    uploadTrialFromText(ztext, zext, trial, experiment, setTrialData);
                }
            }
        } else {
            throw "unknown file extension " + file.name;
        }
    }, []);

    return {
        downloadGeojson,
        downloadZipCsv,
        uploadTrial,
    }
}