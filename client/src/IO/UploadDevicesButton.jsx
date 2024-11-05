import { HourglassBottom, Upload } from "@mui/icons-material"
import { SCOPE_TRIAL } from "../Experiment/AttributeType";
import { ReadFileAsText } from "./FileIo";
import JSZip from "jszip";
import { parse } from 'csv-parse/browser/esm/sync';
import { useState } from "react";
import { ButtonFile } from "../Utils/ButtonFile";
import { ErrorsDialog } from "./ErrorsDialog";
import { obtainDevicesFromFile } from "./obtainDevicesFromFile";

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

    const uploadTrial = async (file, trial, experiment, setTrialData) => {
        const devices = [];
        await obtainDevicesFromFile(file, (devs) => devices.push(...devs));

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