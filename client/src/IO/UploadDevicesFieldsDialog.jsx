import { Button, Dialog, DialogActions, DialogTitle } from "@mui/material";
import { SCOPE_TRIAL } from "../Experiment/AttributeType";
import { groupBy } from "lodash";

export const UploadDevicesFieldsDialog = ({ devices, setDevices, data, setData, experiment }) => {

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

    const devicesByType = Object.values(groupBy(devices, x => x[1]));

    /// TODO: attach fields from csv to device attributes for each device type
    // nice to have: allow changing the csv fields for name, type, coords etc..
    // refactor needed: get each device as struct, not list

    return (
        <Dialog
            open={true}
            maxWidth={false} fullWidth={true} scroll="paper"
            onClose={() => setDevices(_ => [])}
        >
            <DialogTitle>File upload for {devices?.length} devices</DialogTitle>
            {devicesByType.map((x, i) => (
                <>
                    <span key={i}>{JSON.stringify(x)}</span>
                    <br />
                </>
            ))}
            <DialogActions>
                <Button onClick={uploadTrial}>Upload</Button>
            </DialogActions>
        </Dialog>
    )
}