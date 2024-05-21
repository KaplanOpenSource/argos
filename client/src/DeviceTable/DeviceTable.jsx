import { Paper, Stack, Typography } from "@mui/material"
import { TreeView } from "@mui/x-tree-view/TreeView"
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { useContext } from "react";
import { experimentContext } from "../Context/ExperimentProvider";
import { DeviceItem } from "../Experiment/DeviceItem";
import { SCOPE_TRIAL } from "../Experiment/AttributeType";
import { SelectDeviceButton } from "../Experiment/SelectDeviceButton";
import { DeviceItemLocationButton } from "../Experiment/DeviceItemLocationButton";

export const DeviceTable = ({ showAttributes, setShowAttributes }) => {
    const { selection, currTrial } = useContext(experimentContext);

    const shownDevices = [];
    for (const { deviceTypeName, deviceItemName } of selection || []) {
        const deviceType = (currTrial.experiment || {}).deviceTypes.find(x => x.name === deviceTypeName);
        const deviceItem = ((deviceType || {}).devices || []).find(x => x.name === deviceItemName);
        if (deviceType && deviceItem) {
            shownDevices.push({ deviceType, deviceItem });
        }
    };

    return (
        <>
            {showAttributes
                ? <TreeView
                    defaultCollapseIcon={<ExpandMoreIcon />}
                    defaultExpandIcon={<ChevronRightIcon />}
                    sx={{
                        height: '80vh',
                        overflowY: 'auto',
                    }}
                    disableSelection
                >
                    {shownDevices.map(({ deviceType, deviceItem }) => (
                        <Paper
                            key={deviceType.name + ":" + deviceItem.name}
                            sx={{
                                zIndex: 1000,
                                position: 'relative',
                                maxWidth: 'fit-content',
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
                : <Stack
                    direction='column'
                    alignItems="flex-end"
                    sx={{
                        zIndex: 1000,
                        height: '80vh',
                        overflowY: 'auto',
                    }}
                >
                    {shownDevices.map(({ deviceType, deviceItem }) => (
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
        </>
    )
}