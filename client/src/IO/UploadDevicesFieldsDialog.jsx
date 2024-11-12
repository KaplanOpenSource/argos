import { Button, Dialog, DialogActions, DialogTitle, Paper, Typography } from "@mui/material";
import { SCOPE_TRIAL } from "../Experiment/AttributeType";
import { groupBy } from "lodash";
import { ATTR_UNASSIGNED, UploadDevicesTypeFieldsMatcher } from "./UploadDevicesTypeFieldsMatcher";
import { useState } from "react";

export const UploadDevicesFieldsDialog = ({ devicesToUpload, setDevicesToUpload, data, setData, experiment }) => {

    const [attrMatch, setAttrMatch] = useState({});

    const changeDeviceOnTrial = (trial, experiment, deviceToUpload) => {
        const { type, name, MapName, Latitude, Longitude, attributes } = deviceToUpload;
        const deviceType = experiment?.deviceTypes?.find(x => x.name === type);
        if (deviceType) {
            trial.devicesOnTrial ||= [];
            let deviceOnTrial = trial.devicesOnTrial?.find(x => x.deviceTypeName === type && x.deviceItemName === name);
            if (!deviceOnTrial) {
                deviceOnTrial = { deviceTypeName: type, deviceItemName: name };
                trial.devicesOnTrial.push(deviceOnTrial);
            }

            deviceOnTrial.location = {
                "name": MapName,
                "coordinates": [
                    parseFloat(Latitude),
                    parseFloat(Longitude),
                ]
            }

            const attrMatchForType = Object.entries(attrMatch[deviceType.name]);
            for (const [attrNameOnDev, attrNameFromFile] of attrMatchForType) {
                if (attrNameFromFile || ATTR_UNASSIGNED !== ATTR_UNASSIGNED) {
                    const attrType = deviceType?.attributeTypes?.find(x => x.name === attrNameOnDev);
                    if (attrType && (attrType.scope || SCOPE_TRIAL) === SCOPE_TRIAL) {
                        const value = attributes[attrNameFromFile];
                        if (value || value === 0 || value === '') {
                            const attr = deviceOnTrial.attributes?.find(x => x.name === attrType.name);
                            if (attr) {
                                attr.value = value;
                            } else {
                                deviceOnTrial.attributes ||= [];
                                deviceOnTrial.attributes.push({ name: attrType.name, value });
                            }
                        }
                    }
                }
            }
        }
    }

    const uploadTrial = () => {
        const newTrial = structuredClone(data);
        for (const dev of devicesToUpload) {
            changeDeviceOnTrial(newTrial, experiment, dev);
        }
        setData(newTrial);
        setDevicesToUpload(_ => []);
    };

    const devicesByType = Object.values(groupBy(devicesToUpload, x => x[1]));

    /// TODO: attach fields from csv to device attributes for each device type
    // nice to have: allow changing the csv fields for name, type, coords etc..
    // refactor needed: get each device as struct, not list

    return (
        <Dialog
            open={true}
            maxWidth={false} fullWidth={true} scroll="paper"
            onClose={() => setDevicesToUpload(_ => [])}
        >
            <DialogTitle>File upload for {devicesToUpload?.length} devices</DialogTitle>
            {devicesByType.map((devType, i) => {
                const deviceTypeName = devType[0]?.type;
                const deviceType = experiment?.deviceTypes?.find(x => x.name === deviceTypeName);
                return (
                    <Paper
                        sx={{ margin: 1 }}
                        key={i}
                    >
                        <Typography variant="h6" sx={{ margin: 1 }}>{deviceTypeName}</Typography>
                        {!deviceType
                            ? <Typography>Undefined device type</Typography>
                            : <UploadDevicesTypeFieldsMatcher
                                devicesDetails={devType}
                                deviceType={deviceType}
                                attrMatch={attrMatch[deviceTypeName] || {}}
                                setAttrMatch={v => setAttrMatch({ ...attrMatch, [deviceTypeName]: v })}
                            />
                        }
                    </Paper>
                )
            })}
            <DialogActions>
                <Button onClick={uploadTrial}>Upload</Button>
            </DialogActions>
        </Dialog>
    )
}