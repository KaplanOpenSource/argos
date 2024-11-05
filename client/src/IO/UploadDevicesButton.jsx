import { HourglassBottom, Upload } from "@mui/icons-material"
import { SCOPE_TRIAL } from "../Experiment/AttributeType";
import { useState } from "react";
import { ButtonFile } from "../Utils/ButtonFile";
import { ErrorsDialog } from "./ErrorsDialog";
import { obtainDevicesFromFile } from "./obtainDevicesFromFile";

export const UploadDevicesButton = ({ data, experiment, setData }) => {
    const [working, setWorking] = useState(false);
    const [errors, setErrors] = useState(undefined);

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

    const handleChangeFile = async (files) => {
        setWorking(true);
        try {
            if (!files || !files.length) {
                throw "empty file";
            }

            const devices = [];
            for (const file of files) {
                await obtainDevicesFromFile(file, (devs) => devices.push(...devs));
            }

            const newTrial = structuredClone(data);
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

            setData(newTrial);
        } catch (error) {
            setErrors([error?.message || error]);
        }
        setWorking(false);
    };

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