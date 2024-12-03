import { Box, Paper, Stack, Typography } from "@mui/material"
import { TreeView } from "@mui/x-tree-view/TreeView"
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { useContext } from "react";
import { experimentContext } from "../Context/ExperimentProvider";
import { DeviceItem } from "../Experiment/DeviceItem";
import { SCOPE_TRIAL } from "../Experiment/AttributeType";
import { SelectDeviceButton } from "../Experiment/SelectDeviceButton";
import { DeviceItemLocationButton } from "../Experiment/DeviceItemLocationButton";
import { EnclosingListSelectionContext } from "../Experiment/EnclosedSelectionProvider";
import { SortableList } from "../Utils/SortableList";

export const DeviceTable = ({ showAttributes }) => {
    const { currTrial, selection, setSelection } = useContext(experimentContext);

    const addSelectionIds = (sel) => sel.map(s => {
        return { ...s, id: s.deviceTypeName + ' : ' + s.deviceItemName };
    });

    const removeSelectionIds = (sel) => sel.map(s => {
        const { id, ...r } = s;
        return r;
    });

    return (
        <Box sx={{
            zIndex: 1000,
            height: '80vh',
            maxWidth: '50%',
            width: 'fit-content',
            overflowY: 'auto',
            pointerEvents: 'all',
        }}>
            <SortableList
                items={addSelectionIds(selection)}
                setItems={(funcUpdater) => setSelection(prev => removeSelectionIds(funcUpdater(addSelectionIds(prev))))}
                renderItem={(item) => {
                    const { deviceTypeName, deviceItemName } = item;
                    const deviceType = ((currTrial.experiment || {}).deviceTypes || []).find(x => x.name === deviceTypeName);
                    const deviceItem = ((deviceType || {}).devices || []).find(x => x.name === deviceItemName);
                    return (
                        <Paper
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
                                    devicesEnclosingList={selection}
                                />
                                <DeviceItemLocationButton
                                    deviceType={deviceType}
                                    deviceItem={deviceItem}
                                />
                            </Stack>
                        </Paper>
                    )
                }}
            />
        </Box>
    )

    const shownDevices = [];
    for (const { deviceTypeName, deviceItemName } of selection || []) {
        const deviceType = ((currTrial.experiment || {}).deviceTypes || []).find(x => x.name === deviceTypeName);
        const deviceItem = ((deviceType || {}).devices || []).find(x => x.name === deviceItemName);
        if (deviceType && deviceItem) {
            shownDevices.push({ deviceType, deviceItem, deviceTypeName, deviceItemName });
        }
    };

    return (
        <Box sx={{
            zIndex: 1000,
            height: '80vh',
            maxWidth: '50%',
            width: 'fit-content',
            overflowY: 'auto',
            // pointerEvents: 'all',
        }}>
            {showAttributes
                ? <DeviceTableRich
                    shownDevices={shownDevices}
                />
                : <DeviceTableSmall
                    selection={selection}
                />
            }
        </Box>
    )
}


const DeviceTableRich = ({ shownDevices }) => {
    const {
        selectionOnEnclosingUuids,
        setSelectionOnEnclosingUuids,
    } = useContext(EnclosingListSelectionContext);

    return (
        <TreeView
            defaultCollapseIcon={<ExpandMoreIcon />}
            defaultExpandIcon={<ChevronRightIcon />}
            defaultExpanded={shownDevices.map(({ deviceItem }) => deviceItem.trackUuid)}
            multiSelect
            selected={selectionOnEnclosingUuids}
            onNodeSelect={(e, ids) => setSelectionOnEnclosingUuids(ids)}
        >
            {shownDevices.map(({ deviceType, deviceItem }) => (
                <Paper
                    key={deviceItem.trackUuid}
                    sx={{
                        position: 'relative',
                        maxHeight: 'fit-content',
                        right: '10px',
                        top: '5px',
                    }}
                >
                    <DeviceItem
                        data={deviceItem}
                        deviceType={deviceType}
                        devicesEnclosingList={shownDevices}
                        scope={SCOPE_TRIAL}
                        showAttributes={true}
                    />
                </Paper>
            ))}
        </TreeView>
    )
}

const DeviceTableSmall = ({ }) => {
    const { currTrial, selection, setSelection } = useContext(experimentContext);
    return (
        <Stack
            direction='column'
            alignItems="flex-end"
        >
            <SortableList
                items={selection.map(s => ({ ...s, id: s.deviceTypeName + ' : ' + s.deviceItemName }))}
                setItems={setSelection}
                renderItem={(item) => {
                    const { deviceTypeName, deviceItemName } = item;
                    const deviceType = ((currTrial.experiment || {}).deviceTypes || []).find(x => x.name === deviceTypeName);
                    const deviceItem = ((deviceType || {}).devices || []).find(x => x.name === deviceItemName);
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
                                {/* <SelectDeviceButton
                                    deviceItem={deviceItem}
                                    deviceType={deviceType}
                                    devicesEnclosingList={selection}
                                /> */}
                                <DeviceItemLocationButton
                                    deviceType={deviceType}
                                    deviceItem={deviceItem}
                                />
                            </Stack>
                        </Paper>
                    )
                }}
            />
            {/* {selection.map(({ deviceTypeName, deviceItemName }) => {
            })} */}
        </Stack>
    )
}

// import React, { useState } from 'react';
// import { Paper, Typography } from '@mui/material';
// import { SortableList } from "../Utils/SortableList";


// const ItemShower = ({ id, name }) => (
//     <Paper sx={{ margin: '10px', width: '150px' }}>
//         <Typography>
//             {id}
//         </Typography>
//         <Typography variant='h5'>
//             {name}
//         </Typography>
//     </Paper>
// )

// export function App() {
//     const [items, setItems] = useState([
//         { id: 1, name: "111" },
//         { id: 2, name: "222" },
//         { id: 3, name: "333" },
//     ]);

//     console.log(items)
//     return (
//         <SortableList
//             items={items}
//             setItems={setItems}
//             renderItem={ItemShower}
//         />
//     )
// }