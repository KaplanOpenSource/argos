import { Button, Dialog, DialogActions, DialogTitle, Paper, Typography } from "@mui/material";
import { groupBy, uniq } from "lodash";
import { useState } from "react";
import { changeDeviceOnTrial } from "./changeDeviceOnTrial";
import { SelectFieldWithName } from "./SelectFieldWithName";
import { FIELD_MAPNAME, FIELD_NAME, FIELD_TYPE, FIELD_UNASSIGNED, LOCATION_FIELDS } from "./uploadDefs";
import { UploadDevicesTypeFieldsMatcher } from "./UploadDevicesTypeFieldsMatcher";

export const UploadDevicesFieldsDialog = ({ devicesToUpload, setDevicesToUpload, data, setData, experiment }) => {
  const fields = uniq(devicesToUpload.flatMap(x => Object.keys(x)));
  const [attrMatch, setAttrMatch] = useState(() => {
    return {
      [FIELD_TYPE]: fields.includes(FIELD_TYPE) ? FIELD_TYPE : FIELD_UNASSIGNED,
      [FIELD_NAME]: fields.includes(FIELD_NAME) ? FIELD_NAME : FIELD_UNASSIGNED,
    }
  });

  const uploadTrial = () => {
    const newTrial = structuredClone(data);
    for (const dev of devicesToUpload) {
      changeDeviceOnTrial(newTrial, experiment, dev, attrMatch);
    }
    setData(newTrial);
    setDevicesToUpload(_ => []);
  };

  const devicesByType = Object.values(groupBy(devicesToUpload, x => x[attrMatch[FIELD_TYPE]]));

  let disabled = attrMatch[FIELD_TYPE] === FIELD_UNASSIGNED || attrMatch[FIELD_NAME] === FIELD_UNASSIGNED;
  for (const [k, a] of Object.entries(attrMatch)) {
    if (k !== FIELD_TYPE && k !== FIELD_NAME) {
      for (const f of LOCATION_FIELDS.filter(x => x !== FIELD_MAPNAME)) {
        if ((a[f] || FIELD_UNASSIGNED) === FIELD_UNASSIGNED) {
          disabled = true;
        }
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
      <div style={{ margin: '3px' }}>
        <SelectFieldWithName
          attrName={FIELD_TYPE}
          attrOptions={fields.map(x => ({ name: x }))}
          oneMatch={attrMatch[FIELD_TYPE] || FIELD_UNASSIGNED}
          setOneMatch={updater => {
            setAttrMatch(prev => {
              const val = updater((prev || {})[FIELD_TYPE]);
              return { ...(prev || {}), [FIELD_TYPE]: val };
            });
          }}
        />
      </div>
      <div style={{ margin: '3px' }}>
        <SelectFieldWithName
          attrName={FIELD_NAME}
          attrOptions={fields.map(x => ({ name: x }))}
          oneMatch={attrMatch[FIELD_NAME] || FIELD_UNASSIGNED}
          setOneMatch={updater => {
            setAttrMatch(prev => {
              const val = updater((prev || {})[FIELD_NAME]);
              return { ...(prev || {}), [FIELD_NAME]: val };
            });
          }}
        />
      </div>

      {devicesByType.map((devType, i) => {
        const fieldType = attrMatch[FIELD_TYPE];
        const deviceTypeName = devType[0] && devType[0][fieldType];
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
                headerFields={[attrMatch[FIELD_TYPE], attrMatch[FIELD_NAME]]}
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