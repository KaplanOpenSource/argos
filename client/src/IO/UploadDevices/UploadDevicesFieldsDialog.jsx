import { Button, Dialog, DialogActions, DialogTitle, Paper, Typography } from "@mui/material";
import { groupBy } from "lodash";
import { UploadDevicesTypeFieldsMatcher } from "./UploadDevicesTypeFieldsMatcher";
import { useState } from "react";
import { changeDeviceOnTrial } from "./changeDeviceOnTrial";
import { FIELD_MAPNAME, FIELD_NAME, FIELD_TYPE, FIELD_UNASSIGNED, LOCATION_FIELDS } from "./uploadDefs";

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

    const devicesByType = Object.values(groupBy(devicesToUpload, x => x[FIELD_TYPE]));

    let disabled = false;
    for (const a of Object.values(attrMatch)) {
        for (const f of LOCATION_FIELDS.filter(x => x !== FIELD_MAPNAME)) {
            if ((a[f] || FIELD_UNASSIGNED) === FIELD_UNASSIGNED) {
                disabled = true;
            }
        }
    }

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
                                setAttrMatch={updater => {
                                    setAttrMatch(prev => ({ ...(prev || {}), [deviceTypeName]: updater((prev || {})[deviceTypeName]) }));
                                }}
                                headerFields={[FIELD_TYPE, FIELD_NAME]}
                            />
                        }
                    </Paper>
                )
            })}
            <DialogActions>
                <Button
                    onClick={uploadTrial}
                    disabled={disabled}
                >
                    Upload
                </Button>
            </DialogActions>
        </Dialog>
    )
}