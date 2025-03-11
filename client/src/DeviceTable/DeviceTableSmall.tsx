import React, { useContext } from "react";
import { Paper, Stack, Typography } from "@mui/material"
import { SelectDeviceButton } from "../Experiment/SelectDeviceButton";
import { DeviceItemLocationButton } from "../Experiment/DeviceItemLocationButton";
import { IDevice, IDeviceType, IDeviceTypeAndItem, ITrackUuid } from "../types/types";
import { useDeviceSeletion } from "../Context/useDeviceSeletion";
import { experimentContext } from "../Context/ExperimentProvider";

type ISelectedIndexedItem = IDeviceTypeAndItem & {
    deviceItem: IDevice & ITrackUuid,
    deviceType: IDeviceType & ITrackUuid
};

export const DeviceTableSmall = ({ }) => {

    const { selection, setSelection } = useDeviceSeletion();
    const { currTrial } = useContext(experimentContext);

    const shownDevices: ISelectedIndexedItem[] = [];
    for (const { deviceTypeName, deviceItemName } of selection || []) {
        const deviceType = ((currTrial.experiment || {}).deviceTypes || []).find(x => x.name === deviceTypeName);
        const deviceItem = ((deviceType || {}).devices || []).find(x => x.name === deviceItemName);
        if (deviceType && deviceItem) {
            shownDevices.push({ deviceType, deviceItem, deviceTypeName, deviceItemName });
        }
    };

    return (
        <Stack
            direction='column'
            alignItems="flex-end"
        >
            {shownDevices.map(({ deviceType, deviceItem }) => (
                < DeviceSmallClip
                    key={deviceItem.trackUuid}
                    deviceItem={deviceItem}
                    deviceType={deviceType}
                    shownDevices={shownDevices}
                />
            ))}
        </Stack>
    )
}

const DeviceSmallClip = ({
    deviceItem,
    deviceType,
    shownDevices,
}: {
    deviceItem: IDevice & ITrackUuid,
    deviceType: IDeviceType & ITrackUuid,
    shownDevices: ISelectedIndexedItem[],
}) => {
    return (
        <Paper
            key={deviceItem.trackUuid}
            sx={{
                paddingLeft: '5px',
                maxWidth: 'fit-content'
            }}
        >
            <Stack
                direction='row'
                alignItems='center'
                justifyContent="end"
            >
                <Typography>
                    {deviceItem.name}
                </Typography>
                <SelectDeviceButton
                    deviceItem={deviceItem}
                    deviceType={deviceType}
                    devicesEnclosingList={shownDevices}
                />
                <DeviceItemLocationButton
                    deviceType={deviceType}
                    deviceItem={deviceItem}
                    surroundingDevices={shownDevices}
                />
            </Stack>
        </Paper>
    )
}

