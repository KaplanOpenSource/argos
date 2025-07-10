import { Delete } from '@mui/icons-material';
import {
  Box,
  Stack, Typography
} from '@mui/material';
import { useExperimentProvider } from '../../Context/ExperimentProvider';
import { useChosenTrial } from '../../Context/useChosenTrial';
import { useCurrTrial } from '../../Context/useCurrTrial';
import { AttributeItemList } from '../../Experiment/AttributeItemList';
import { AddContainedButton } from '../../Experiment/Contained/AddContainedButton';
import { ContainedDevice } from '../../Experiment/Contained/ContainedDevice';
import { DeviceItemLocationButton } from '../../Experiment/DeviceItemLocationButton';
import { SelectDeviceButton } from '../../Experiment/SelectDeviceButton';
import { DeviceOnTrialObj } from '../../objects';
import { IDeviceOnTrial, ScopeEnum } from '../../types/types';
import { ButtonTooltip } from '../../Utils/ButtonTooltip';
import { ContainedDevicesList } from './ContainedDevicesList';
import { DeviceLocationEdit } from './DeviceLocationEdit';

export const SingleDevicePropertiesView = ({
  deviceOnTrial,
  children,
}: {
  deviceOnTrial: IDeviceOnTrial,
  children?: any,
}) => {
  const { currTrial } = useExperimentProvider();
  const experiment = currTrial.experiment || {};
  const { deviceTypeName, deviceItemName } = deviceOnTrial;
  const { trial } = useCurrTrial({});
  const device = trial.getDevice(deviceTypeName, deviceItemName);
  const { shownMap, changeTrialObj } = useChosenTrial();

  const deviceType = (experiment.deviceTypes || []).find(t => t.name === deviceTypeName);
  const deviceItem = ((deviceType || []).devices || []).find(t => t.name === deviceItemName);

  const devicesOnTrial = (currTrial.trial || {}).devicesOnTrial || [];
  const containedDevicesIndices = devicesOnTrial
    .map((dev, index) => {
      return { dev, index };
    })
    .filter(({ dev }) => {
      return dev.containedIn
        && dev.containedIn.deviceItemName === deviceItemName
        && dev.containedIn.deviceTypeName === deviceTypeName;
    });

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
        setLocation={(loc) => device.setLocationOnMap(loc, shownMap?.name)}
      />
      {deviceItem
        ? <Box sx={{ overflowY: 'auto', maxHeight: 300 }}>
          <AttributeItemList
            attributeTypes={deviceType.attributeTypes}
            data={deviceOnTrial}
            setData={setDeviceOnTrial}
            scope={ScopeEnum.SCOPE_TRIAL}
            deviceItem={deviceItem}
          />
        </Box>
        : <Typography variant='body2'>
          This device exists on trial but not on experiment, please remove.
          <ButtonTooltip
            onClick={() => setDeviceOnTrial(undefined)}
          >
            <Delete />
          </ButtonTooltip>
        </Typography>
      }
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
            deviceItem={deviceItem}
            deviceType={deviceType}
            hasContainedDevices={containedDevicesIndices?.length > 0}
          />
        }
      </Stack>
      {children}
      {deviceOnTrial.containedIn && (
        <>
          <br />
          parent:
          <ContainedDevice
            key={'parent ' + deviceItemName + '_' + deviceTypeName}
            deviceItemName={deviceOnTrial.containedIn.deviceItemName}
            deviceTypeName={deviceOnTrial.containedIn.deviceTypeName}
            disconnectDevice={() => {
              const newdev = { ...deviceOnTrial };
              delete newdev.containedIn;
              setDeviceOnTrial(newdev);
            }}
          />
        </>
      )}
      {containedDevicesIndices?.length > 0
        ? (
          <>
            <br />
            contains:
            <ContainedDevicesList
              containedDevices={containedDevicesIndices}
              devicesOnTrial={devicesOnTrial}
            />
          </>
        )
        : null}
    </>
  )
}