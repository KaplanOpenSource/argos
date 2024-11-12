import { ReadFileAsText } from "../FileIo";
import JSZip from "jszip";
import { parse } from 'csv-parse/browser/esm/sync';
import { DevicesFromFile } from "./uploadDefs";

const obtainDeviceFromJson = (text: string): DevicesFromFile[] => {
    const json = JSON.parse(text);
    const devices: DevicesFromFile[] = [];
    for (const dev of json.features) {
        const attributes = {
            ...dev.properties,
            MapName: dev.properties.MapName,
            Latitude: dev.geometry.coordinates[1],
            Longitude: dev.geometry.coordinates[0],
        };
        devices.push({
            type: dev.properties.type,
            name: dev.properties.name,
            attributes,
        });
    }
    return devices;
}

const obtainDeviceFromCsv = (text: string): DevicesFromFile[] => {
    const devices: DevicesFromFile[] = [];
    const lines = parse(text);
    const deviceLines = lines.slice(1).map(line => {
        return Object.fromEntries(lines[0].map((o, i) => [o, line[i]]));
    });
    for (const dev of deviceLines) {
        devices.push({
            type: dev.type,
            name: dev.name,
            attributes: dev
        });
    }
    return devices;
}

const obtainDeviceFromText = (ext: string, text: string): DevicesFromFile[] => {
    if (ext === 'csv') {
        return obtainDeviceFromCsv(text);
    }

    if (ext?.endsWith('json')) {
        return obtainDeviceFromJson(text);
    }

    throw "unknown file extension " + ext;
}

export const obtainDevicesFromFile = async (file: File): Promise<DevicesFromFile[]> => {
    const ext = file?.name?.split('.')?.pop()?.toLowerCase() || '';

    if (ext === 'csv' || ext?.endsWith('json')) {
        const text = await ReadFileAsText(file);
        return obtainDeviceFromText(ext, text) || [];
    }

    if (ext === 'zip') {
        const devices: DevicesFromFile[] = [];
        
        const zip = await JSZip().loadAsync(file);
        for (const z of Object.values(zip.files)) {
            const zext = z?.name?.split('.')?.pop()?.toLowerCase() || '';

            if (zext === 'csv' || zext?.endsWith('json')) {
                const text = await z.async('text');
                const currdevs = obtainDeviceFromText(zext, text) || [];
                devices.push(...currdevs);
            }
        }

        return devices;
    }

    throw "unknown file extension " + file.name;
}