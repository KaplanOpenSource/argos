import { Box, Paper, Stack, Typography } from "@mui/material"
import { TreeView } from "@mui/x-tree-view/TreeView"
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { useContext, useState } from "react";
import { experimentContext } from "../Context/ExperimentProvider";
import { DeviceItem } from "../Experiment/DeviceItem";
import { SCOPE_TRIAL } from "../Experiment/AttributeType";
import { SelectDeviceButton } from "../Experiment/SelectDeviceButton";
import { DeviceItemLocationButton } from "../Experiment/DeviceItemLocationButton";

export const DeviceTable = ({ showAttributes }) => {
    const { selection, currTrial } = useContext(experimentContext);
    const [selectionOnEnclosingList, setSelectionOnEnclosingList] = useState([]);

    const shownDevices = [];
    for (const { deviceTypeName, deviceItemName } of selection || []) {
        const deviceType = ((currTrial.experiment || {}).deviceTypes || []).find(x => x.name === deviceTypeName);
        const deviceItem = ((deviceType || {}).devices || []).find(x => x.name === deviceItemName);
        if (deviceType && deviceItem) {
            shownDevices.push({ deviceType, deviceItem, deviceTypeName, deviceItemName });
        }
    };

    console.log(selectionOnEnclosingList)
    return (
        <Box sx={{
            zIndex: 1000,
            height: '80vh',
            maxWidth: '50%',
            width: 'fit-content',
            overflowY: 'auto',
        }}>
            {showAttributes
                ? <TreeView
                    defaultCollapseIcon={<ExpandMoreIcon />}
                    defaultExpandIcon={<ChevronRightIcon />}
                    multiSelect
                    defaultExpanded={shownDevices.map(({ deviceItem }) => deviceItem.trackUuid)}
                    selected={selectionOnEnclosingList}
                    onNodeSelect={(e, ids) => setSelectionOnEnclosingList(ids)}
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
                                selectionOnEnclosingList={selectionOnEnclosingList}
                                scope={SCOPE_TRIAL}
                                showAttributes={true}
                            />
                        </Paper>
                    ))}
                </TreeView>
                : <Stack
                    direction='column'
                    alignItems="flex-end"
                >
                    {shownDevices.map(({ deviceType, deviceItem }) => (
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
                                />
                            </Stack>
                        </Paper>
                    ))}
                </Stack>
            }
        </Box>
    )
}