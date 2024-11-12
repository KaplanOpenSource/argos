import { Button, Dialog, DialogActions, DialogTitle, Paper, Typography } from "@mui/material";
import { groupBy } from "lodash";
import { UploadDevicesTypeFieldsMatcher } from "./UploadDevicesTypeFieldsMatcher";
import { useState } from "react";
import { changeDeviceOnTrial } from "./changeDeviceOnTrial";

export const UploadDevicesFieldsDialog = ({ devicesToUpload, setDevicesToUpload, data, setData, experiment }) => {

    const [attrMatch, setAttrMatch] = useState({});

    const uploadTrial = () => {
        const newTrial = structuredClone(data);
        for (const dev of devicesToUpload) {
            changeDeviceOnTrial(newTrial, experiment, dev, attrMatch);
        }
        setData(newTrial);
        setDevicesToUpload(_ => []);
    };

    const devicesByType = Object.values(groupBy(devicesToUpload, x => x[1]));

    /// TODO: attach fields from csv to device attributes for each device type
    // nice to have: allow changing the csv fields for name, type, coords etc..

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