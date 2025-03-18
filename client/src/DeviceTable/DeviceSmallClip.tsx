import React from "react";
import { Paper, Stack, Typography } from "@mui/material"
import { SelectDeviceButton } from "../Experiment/SelectDeviceButton";
import { DeviceItemLocationButton } from "../Experiment/DeviceItemLocationButton";
import { IDevice, IDeviceType, IDeviceTypeAndItem, ITrackUuid } from "../types/types";

export type ISelectedIndexedItem = IDeviceTypeAndItem & {
    deviceItem: IDevice & ITrackUuid,
    deviceType: IDeviceType & ITrackUuid,
    id: string,
};

export const DeviceSmallClip = ({
    deviceItem,
    deviceType,
    shownDevices,
    showAsSelected,
}: {
    deviceItem: IDevice & ITrackUuid,
    deviceType: IDeviceType & ITrackUuid,
    shownDevices: ISelectedIndexedItem[],
    showAsSelected?: boolean,
}) => {
    return (
        <Paper
            key={deviceItem.trackUuid}
            sx={{
                paddingLeft: '5px',
                maxWidth: 'fit-content',
                backgroundColor: showAsSelected ? '#d1e4f6' : '',
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

