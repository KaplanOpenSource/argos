import {
  Box,
  Stack, Typography
} from '@mui/material';
import { useChosenTrial } from '../../Context/useChosenTrial';
import { AttributeItemOnTrial } from '../../Experiment/AttributeItemOnTrial';
import { AddContainedButton } from '../../Experiment/Contained/AddContainedButton';
import { DeviceItemLocationButton } from '../../Experiment/DeviceItemLocationButton';
import { SelectDeviceButton } from '../../Experiment/SelectDeviceButton';
import { DeviceOnTrialObj } from '../../objects';
import { ContainedDevicesList } from './ContainedDevicesList';
import { DeviceLocationEdit } from './DeviceLocationEdit';

export const SingleDevicePropertiesView = ({
  deviceOnTrial,
  children,
}: {
  deviceOnTrial: DeviceOnTrialObj,
  children?: any,
}) => {
  const { deviceTypeName, deviceItemName } = deviceOnTrial;
  const { shownMap, changeTrialObj } = useChosenTrial();

  const deviceItem = deviceOnTrial.deviceItem;
  const deviceType = deviceItem.deviceType;

  const containedDevices = deviceOnTrial.getContainedDevices();

  return (
    <>
      <Typography variant='h6'>
        {deviceItemName}
      </Typography>
      <Typography variant='caption'>
        {deviceTypeName}
      </Typography>
      <br />
      <DeviceLocationEdit
        location={deviceOnTrial?.location?.coordinates}
        setLocation={(loc) => {
          changeTrialObj(draft => draft.findDevice(deviceOnTrial)?.setLocationOnMap(loc, shownMap?.name));
        }}
      />
      <Box sx={{ overflowY: 'auto', maxHeight: 300 }}>
        {deviceItem.deviceType.attributeTypes.map(attrType => (
          <AttributeItemOnTrial
            key={attrType.trackUuid}
            attrType={attrType}
            deviceOnTrial={deviceOnTrial}
          />)
        )}
      </Box>
      <Stack direction='row'>
        {deviceItem &&
          <SelectDeviceButton
            deviceItem={deviceItem}
            deviceType={deviceType}
          />
        }
        <DeviceItemLocationButton
          deviceItem={deviceItem}
          deviceType={deviceType}
        />
        {deviceItem &&
          <AddContainedButton
            deviceOnTrial={deviceOnTrial}
            hasContainedDevices={containedDevices?.length > 0}
          />
        }
      </Stack>
      {children}
      <ContainedDevicesList
        containedDevices={containedDevices}
      />
    </>
  )
}