import { parse } from 'csv-parse/browser/esm/sync';
import JSZip from "jszip";
import { ReadFileAsText } from "../FileIo";

const obtainDeviceFromJson = (text: string): { [key: string]: any }[] => {
  const json = JSON.parse(text);
  const devices: { [key: string]: any }[] = [];
  for (const dev of json.features) {
    devices.push({
      ...dev.properties,
      Latitude: dev.geometry.coordinates[1],
      Longitude: dev.geometry.coordinates[0],
    });
  }
  return devices;
}

const obtainDeviceFromCsv = (text: string): { [key: string]: any }[] => {
  const lines: string[][] = parse(text);
  const deviceLines = lines.slice(1).map(line => {
    return Object.fromEntries(lines[0].map((o: string, i: any) => [o.trim(), line[i].trim()]));
  });
  return deviceLines;
}

const obtainDeviceFromText = (ext: string, text: string): { [key: string]: any }[] => {
  if (ext === 'csv') {
    return obtainDeviceFromCsv(text);
  }

  if (ext?.endsWith('json')) {
    return obtainDeviceFromJson(text);
  }

  throw "unknown file extension " + ext;
}

export const obtainDevicesFromFile = async (file: File): Promise<{ [key: string]: any }[]> => {
  const ext = file?.name?.split('.')?.pop()?.toLowerCase() || '';

  if (ext === 'csv' || ext?.endsWith('json')) {
    const text = await ReadFileAsText(file);
    return obtainDeviceFromText(ext, text) || [];
  }

  if (ext === 'zip') {
    const devices: { [key: string]: any }[] = [];
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