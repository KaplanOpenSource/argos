import {
  Box,
  Stack, Typography
} from '@mui/material';
import { useChosenTrial } from '../../Context/useChosenTrial';
import { AttributeItemList } from '../../Experiment/AttributeItemList';
import { AddContainedButton } from '../../Experiment/Contained/AddContainedButton';
import { DeviceItemLocationButton } from '../../Experiment/DeviceItemLocationButton';
import { SelectDeviceButton } from '../../Experiment/SelectDeviceButton';
import { DeviceOnTrialObj } from '../../objects';
import { ScopeEnum } from '../../types/ScopeEnum';
import { IDeviceOnTrial } from '../../types/types';
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

  const setDeviceOnTrial = (newDeviceData: IDeviceOnTrial | undefined) => {
    changeTrialObj(draft => {
      const idx = (draft.devicesOnTrial || []).findIndex(x => x.isSame(deviceOnTrial));
      if (idx !== -1) {
        if (!newDeviceData) {
          draft.devicesOnTrial.splice(idx, 1);
        } else {
          const oldDev = draft.devicesOnTrial[idx];
          draft.devicesOnTrial[idx] = new DeviceOnTrialObj(newDeviceData, oldDev.deviceItem, oldDev.trial);
        }
      }
    });
  }

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
        <AttributeItemList
          attributeTypes={deviceType.attributeTypes}
          data={deviceOnTrial}
          setData={setDeviceOnTrial}
          scope={ScopeEnum.SCOPE_TRIAL}
          deviceItem={deviceItem}
        />
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