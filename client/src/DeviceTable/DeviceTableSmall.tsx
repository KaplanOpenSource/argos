import React, { useContext, useState } from "react";
import { Paper, Stack, Typography } from "@mui/material"
import { SelectDeviceButton } from "../Experiment/SelectDeviceButton";
import { DeviceItemLocationButton } from "../Experiment/DeviceItemLocationButton";
import { IDevice, IDeviceType, IDeviceTypeAndItem, IExperiment, ITrackUuid } from "../types/types";
import { useDeviceSeletion } from "../Context/useDeviceSeletion";
import { experimentContext } from "../Context/ExperimentProvider";

import { DndContext, closestCenter } from '@dnd-kit/core';
import { arrayMove, SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { SortableList } from "../lib/SortableList/SortableList";
import { DeviceSmallClip, ISelectedIndexedItem } from "./DeviceSmallClip";

// const { DndContext, closestCenter } = window['dnd-kit'];
//     const { arrayMove, SortableContext, verticalListSortingStrategy } = window.sortable;
// const { useState } = React;

// const Comp = ({ items, setItems }) => {
//     return (
//         <SortableList
//             items={items}
//             onChange={setItems}
//             renderItem={(item) => (
//                 <SortableList.Item id={item.id}>
//                     {item.id}
//                     <SortableList.DragHandle />
//                 </SortableList.Item>
//             )}
//         />
//     );
// };

// const items = [
//     { id: '1', name: 'Item 1' },
//     { id: '2', name: 'Item 2' },
//     { id: '3', name: 'Item 3' },
//     { id: '4', name: 'Item 4' },
//     { id: '5', name: 'Item 5' },
// ];

export const DeviceTableSmall = ({ }) => {
    //     return <Paper>
    //         <Comp items={appItems} setItems={setAppItems} />
    //     </Paper>
    // }

    const { selection, setSelection } = useDeviceSeletion();
    const { currTrial } = useContext(experimentContext);

    const shownDevices: ISelectedIndexedItem[] = [];
    let i = 0;
    for (const { deviceTypeName, deviceItemName } of (selection as IDeviceTypeAndItem[] || [])) {
        const deviceType = ((currTrial.experiment as IExperiment || {}).deviceTypes || []).find(x => x.name === deviceTypeName);
        const deviceItem = ((deviceType || {}).devices || []).find(x => x.name === deviceItemName);
        if (deviceType && deviceItem) {
            const id = (deviceItem as (IDevice & ITrackUuid)).trackUuid || (++i).toString();
            shownDevices.push({ deviceType, deviceItem, deviceTypeName, deviceItemName, id });
        }
    };

    // const [items, setItems] = useState(shownDevices.map((x, i) => ({ ...x, id: x.deviceItem.trackUuid || i.toString() })));
    // const items = shownDevices.map((x, i) => ({ ...x, id: x.deviceItem.trackUuid || i.toString() }));

    return (
        <SortableList
            items={shownDevices}
            onChange={() => { }}
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

    // return (
    //     <Stack
    //         direction='column'
    //         alignItems="flex-end"
    //     >
    //         {shownDevices.map(({ deviceType, deviceItem }) => (
    //             <DeviceSmallClip
    //                 key={deviceItem.trackUuid}
    //                 deviceItem={deviceItem}
    //                 deviceType={deviceType}
    //                 shownDevices={shownDevices}
    //             />
    //         ))}
    //     </Stack>
    // )
}

