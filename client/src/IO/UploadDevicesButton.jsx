import { HourglassBottom, Upload } from "@mui/icons-material"
import { SCOPE_TRIAL } from "../Experiment/AttributeType";
import { ReadFileAsText } from "./FileIo";
import JSZip from "jszip";
import { parse } from 'csv-parse/browser/esm/sync';
import { useState } from "react";
import { ButtonFile } from "../Utils/ButtonFile";
import { ErrorsDialog } from "./ErrorsDialog";

export const UploadDevicesButton = ({ data, experiment, setData }) => {
    const [working, setWorking] = useState(false);
    const [errors, setErrors] = useState(undefined);

    const handleChangeFile = async (files) => {
        try {
            setWorking(true);
            if (!files || !files.length) {
                throw "empty file";
            }
            const errors = await uploadTrial(files[0], data, experiment, (newData) => setData(newData));
            if (errors) {
                setErrors(errors);
            }
        } catch (error) {
            console.log(error)
            alert(`problem uploading:\n${error}`)
        }
        setWorking(false);
    };

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

    const uploadTrialFromText = (text, fileExt, trial, experiment, setTrialData) => {
        const devices = [];
        if (fileExt.endsWith('json')) {
            const json = JSON.parse(text);
            for (const dev of json.features) {
                devices.push([
                    dev.properties.type,
                    dev.properties.name,
                    dev.properties.MapName,
                    dev.geometry.coordinates[1],
                    dev.geometry.coordinates[0],
                    dev.properties]);
            }
        } else if (fileExt === 'csv') {
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
        } else {
            throw "unknown file extension " + fileExt;
        }
        return devices;
    }

    const uploadTrial = async (file, trial, experiment, setTrialData) => {
        const devices = [];

        const ext = file.name.split('.').pop().toLowerCase();
        if (ext === 'json' || ext === 'geojson' || ext === 'csv') {
            const text = await ReadFileAsText(file);
            const newdevs = uploadTrialFromText(text, ext, trial, experiment, setTrialData);
            devices.push(...newdevs);
        } else if (ext === 'zip') {
            const zip = await JSZip().loadAsync(file);
            for (const z of Object.values(zip.files)) {
                const zext = z.name.split('.').pop().toLowerCase();
                if (zext === 'json' || zext === 'geojson' || zext === 'csv') {
                    const ztext = await z.async('text');
                    const newdevs = uploadTrialFromText(ztext, zext, trial, experiment, setTrialData);
                    devices.push(...newdevs);
                }
            }
        } else {
            throw "unknown file extension " + file.name;
        }

        const newTrial = structuredClone(trial);
        for (const [deviceTypeName, deviceItemName, MapName, Latitude, Longitude, attributes] of devices) {
            setDeviceOnTrial(
                newTrial,
                experiment,
                deviceTypeName,
                deviceItemName,
                MapName,
                Latitude,
                Longitude,
                attributes);
        }
        setTrialData(newTrial);
    }

    return (
        <>
            <ButtonFile
                color='default'
                accept=".json,.geojson,.csv,.zip"
                tooltip={'Upload devices as geojson, csv, zip of csvs'}
                onChange={handleChangeFile}
                disabled={working}
            >
                {working
                    ? <HourglassBottom />
                    : <Upload />
                }
            </ButtonFile>
            <ErrorsDialog
                isOpen={errors && errors?.length}
                errors={errors}
                onClose={() => setErrors(undefined)}
            />
        </>
    )
}