import { ReadFileAsText } from "./FileIo";
import JSZip from "jszip";
import { parse } from 'csv-parse/browser/esm/sync';

const obtainDeviceFromJson = (text) => {
    const json = JSON.parse(text);
    const devices = [];
    for (const dev of json.features) {
        devices.push([
            dev.properties.type,
            dev.properties.name,
            dev.properties.MapName,
            dev.geometry.coordinates[1],
            dev.geometry.coordinates[0],
            dev.properties]);
    }
    return devices;
}

const obtainDeviceFromCsv = (text) => {
    const devices = [];
    const lines = parse(text);
    const deviceLines = lines.slice(1).map(line => {
        return Object.fromEntries(lines[0].map((o, i) => [o, line[i]]));
    });
    for (const dev of deviceLines) {
        devices.push([
            dev.type,
            dev.name,
            dev.MapName,
            dev.Latitude,
            dev.Longitude,
            dev]);
    }
    return devices;
}

const obtainDevicesFromText = (text, ext) => {
    if (ext.endsWith('json')) {
        return obtainDeviceFromJson(text);
    } else if (ext === 'csv') {
        return obtainDeviceFromCsv(text);
    } else {
        throw "unknown file extension " + ext;
    }
}

export const obtainDevicesFromFile = async (file, addDevices) => {
    const ext = file.name.split('.').pop().toLowerCase();
    if (ext === 'json' || ext === 'geojson' || ext === 'csv') {
        const text = await ReadFileAsText(file);
        addDevices(obtainDevicesFromText(text, ext));
    } else if (ext === 'zip') {
        const zip = await JSZip().loadAsync(file);
        for (const z of Object.values(zip.files)) {
            const zext = z.name.split('.').pop().toLowerCase();
            if (zext === 'json' || zext === 'geojson' || zext === 'csv') {
                const ztext = await z.async('text');
                addDevices(obtainDevicesFromText(ztext));
            }
        }
    } else {
        throw "unknown file extension " + file.name;
    }
}