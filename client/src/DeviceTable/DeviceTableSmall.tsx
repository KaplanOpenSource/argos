import React, { useContext } from "react";
import { Stack } from "@mui/material"
import { IDevice, IDeviceTypeAndItem, IExperiment, ITrackUuid } from "../types/types";
import { useDeviceSeletion } from "../Context/useDeviceSeletion";
import { experimentContext } from "../Context/ExperimentProvider";

import { SortableList } from "../lib/SortableList/SortableList";
import { DeviceSmallClip, ISelectedIndexedItem } from "./DeviceSmallClip";

export const DeviceTableSmall = ({ }) => {

    const { selection, setSelection } = useDeviceSeletion();
    const { currTrial } = useContext(experimentContext);

    function findDeviceInExperiment(deviceTypeName: string, deviceItemName: string) {
        const deviceType = ((currTrial.experiment as IExperiment || {}).deviceTypes || []).find(x => x.name === deviceTypeName);
        const deviceItem = ((deviceType || {}).devices || []).find(x => x.name === deviceItemName);
        return { deviceType, deviceItem };
    }

    const shownDevices: ISelectedIndexedItem[] = [];
    for (const { deviceTypeName, deviceItemName } of (selection || [])) {
        const { deviceType, deviceItem } = findDeviceInExperiment(deviceTypeName, deviceItemName);
        if (deviceType && deviceItem) {
            const id = (deviceItem as (IDevice & ITrackUuid)).trackUuid!;
            shownDevices.push({ deviceType, deviceItem, deviceTypeName, deviceItemName, id });
        }
    };

    function handleChangeSelection(items: ISelectedIndexedItem[]): void {
        setSelection(items);
    }

    return (
        <SortableList
            items={shownDevices}
            onChange={handleChangeSelection}
            renderItem={({ deviceItem, deviceType, id }) => (
                <SortableList.Item id={id}>
                    <Stack
                        direction='row'
                        alignItems='right'
                        justifyContent='right'
                    >
                        <DeviceSmallClip
                            key={id}
                            deviceItem={deviceItem}
                            deviceType={deviceType}
                            shownDevices={shownDevices}
                        />
                        <SortableList.DragHandle />
                    </Stack>
                </SortableList.Item>
            )}
        />
    );
}

