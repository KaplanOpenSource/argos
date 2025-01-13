import React, { useContext } from 'react';
import {
    Stack, Typography
} from '@mui/material';
import {
    Place,
} from "@mui/icons-material";
import { ButtonTooltip } from '../../Utils/ButtonTooltip';
import { experimentContext } from '../../Context/ExperimentProvider';
import { SelectDeviceButton } from '../../Experiment/SelectDeviceButton';
import { AttributeItemList } from '../../Experiment/AttributeItemList';
import { SCOPE_TRIAL } from '../../Experiment/AttributeType';
import { AddContainedButton } from '../../Experiment/Contained/AddContainedButton';
import { ContainedDevice } from '../../Experiment/Contained/ContainedDevice';
import { DeviceLocationEdit } from './DeviceLocationEdit';
import { ContainedDevicesList } from './ContainedDevicesList';
import { useCurrTrial } from '../../Context/useCurrTrial';
import { DeviceItemLocationButton } from '../../Experiment/DeviceItemLocationButton';

export const SingleDevicePropertiesView = ({ deviceOnTrial, setDeviceOnTrial, children }) => {
    const { currTrial, setLocationsToDevices, setTrialData } = useContext(experimentContext);
    const experiment = currTrial.experiment || {};
    const { deviceTypeName, deviceItemName } = deviceOnTrial;
    const { trial } = useCurrTrial({});
    const device = trial.getDevice(deviceTypeName, deviceItemName);

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

    return (
        <>
            <Typography variant='h6'>
                {deviceItemName}
            </Typography>
            <Typography variant='p'>
                {deviceTypeName}
            </Typography>
            <br />
            <DeviceLocationEdit
                location={deviceOnTrial.location.coordinates}
                setLocation={(loc) => device.setLocationOnMap(loc, currTrial.mapName)}
            />
            {deviceItem
                ? <AttributeItemList
                    attributeTypes={deviceType.attributeTypes}
                    data={deviceOnTrial}
                    setData={setDeviceOnTrial}
                    scope={SCOPE_TRIAL}
                    deviceItem={deviceItem}
                />
                : <Typography variant='body2'>
                    This device exists on trial but not on experiment, please remove.
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
                        deviceOnTrial={deviceOnTrial}
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
                        contained:
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