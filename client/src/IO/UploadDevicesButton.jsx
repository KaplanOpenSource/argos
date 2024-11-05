import { Upload } from "@mui/icons-material"
import { UploadButton } from "./UploadButton"
import { SCOPE_TRIAL } from "../Experiment/AttributeType";
import { ReadFileAsText } from "./FileIo";
import JSZip from "jszip";
import { parse } from 'csv-parse/browser/esm/sync';

export const UploadDevicesButton = ({ data, experiment, setData }) => {

    const setDeviceOnTrial = (trial, experiment, deviceTypeName, deviceItemName, MapName, Latitude, Longitude, otherProps) => {
        const deviceType = experiment?.deviceTypes?.find(x => x.name === deviceTypeName);
        if (deviceType) {
            trial.devicesOnTrial ||= [];
            let deviceOnTrial = trial.devicesOnTrial?.find(x => x.deviceTypeName === deviceTypeName && x.deviceItemName === deviceItemName);
            if (!deviceOnTrial) {
                deviceOnTrial = { deviceTypeName, deviceItemName };
                trial.devicesOnTrial.push(deviceOnTrial);
            }
            deviceOnTrial.location = {
                "name": MapName,
                "coordinates": [
                    parseFloat(Latitude),
                    parseFloat(Longitude),
                ]
            }
            for (const attrType of deviceType.attributeTypes || []) {
                if (attrType.scope === SCOPE_TRIAL) {
                    const value = otherProps[attrType.name];
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

    const uploadTrialFromText = async (text, fileExt, trial, experiment, setTrialData) => {
        if (fileExt.endsWith('json')) {
            const json = JSON.parse(text);
            const newTrial = structuredClone(trial);
            for (const dev of json.features) {
                setDeviceOnTrial(
                    newTrial,
                    experiment,
                    dev.properties.type,
                    dev.properties.name,
                    dev.properties.MapName,
                    dev.geometry.coordinates[1],
                    dev.geometry.coordinates[0],
                    dev.properties);
            }
            setTrialData(newTrial);
        } else if (fileExt === 'csv') {
            const lines = parse(text);
            const deviceLines = lines.slice(1).map(line => {
                return Object.fromEntries(lines[0].map((o, i) => [o, line[i]]));
            });
            const newTrial = structuredClone(trial);
            for (const dev of deviceLines) {
                setDeviceOnTrial(newTrial,
                    experiment,
                    dev.type,
                    dev.name,
                    dev.MapName,
                    dev.Latitude,
                    dev.Longitude,
                    dev);
            }
            setTrialData(newTrial);
        } else {
            throw "unknown file extension " + fileExt;
        }
    }

    const uploadTrial = async (file, trial, experiment, setTrialData) => {
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
    }

    return (
        <UploadButton
            tooltip={'Upload devices as geojson, csv, zip of csvs'}
            uploadFunc={file => uploadTrial(file, data, experiment, (newData) => setData(newData))}
            color='default'
        >
            <Upload />
        </UploadButton>
    )
}