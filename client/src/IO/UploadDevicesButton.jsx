import { HourglassBottom, Upload } from "@mui/icons-material"
import { SCOPE_TRIAL } from "../Experiment/AttributeType";
import { useState } from "react";
import { ButtonFile } from "../Utils/ButtonFile";
import { ErrorsDialog } from "./ErrorsDialog";
import { obtainDevicesFromFile } from "./obtainDevicesFromFile";
import { Button, Dialog, DialogActions, DialogTitle } from "@mui/material";

export const UploadDevicesButton = ({ data, experiment, setData }) => {
    const [working, setWorking] = useState(false);
    const [errors, setErrors] = useState(undefined);
    const [devices, setDevices] = useState([]);

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

            setDevices([]);
            for (const file of files) {
                await obtainDevicesFromFile(file, (devs) => {
                    setDevices(prev => [...prev, ...devs])
                });
            }
        } catch (error) {
            setErrors([error?.message || error]);
        }
        setWorking(false);
    };

    const uploadTrial = () => {
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
        setDevices(_ => []);
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
                isOpen={errors?.length}
                errors={errors}
                onClose={() => setErrors(undefined)}
            />
            {errors?.length || !devices?.length ? null :
                <Dialog
                    open={true}
                    maxWidth={false} fullWidth={true} scroll="paper"
                    onClose={() => setDevices(_ => [])}
                >
                    <DialogTitle >File upload for {devices?.length} devices</DialogTitle>
                    {devices.map(x => <span>{JSON.stringify(x)}</span>)}
                    <DialogActions>
                        <Button onClick={uploadTrial}>Go</Button>
                    </DialogActions>
                </Dialog>
            }
        </>
    )
}