import { Box, Button, Paper } from "@mui/material"
import { TreeView } from "@mui/x-tree-view/TreeView"
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import { useContext, useState } from "react";
import { experimentContext } from "../Context/ExperimentProvider";
import { DeviceItem } from "../Experiment/DeviceItem";
import { ButtonTooltip } from "../Utils/ButtonTooltip";
import { SCOPE_TRIAL } from "../Experiment/AttributeType";

export const DeviceTable = ({ showAttributes, setShowAttributes }) => {
    const { selection, currTrial } = useContext(experimentContext);

    const shownDevices = [];
    for (const { deviceTypeName, deviceItemName } of selection || []) {
        const deviceType = (currTrial.experiment || {}).deviceTypes.find(x => x.name === deviceTypeName);
        const deviceItem = ((deviceType || {}).devices || []).find(x => x.name === deviceItemName);
        if (deviceType && deviceItem) {
            shownDevices.push({ deviceType, deviceItem, deviceTypeName, deviceItemName });
        }
    };

    return (
        <TreeView
            defaultCollapseIcon={<ExpandMoreIcon />}
            defaultExpandIcon={<ChevronRightIcon />}
            sx={{
                height: '80vh',
                overflowY: 'auto',
            }}
            disableSelection
        >
            {shownDevices.map(({ deviceType, deviceItem, deviceTypeName, deviceItemName }) => (
                <Paper sx={{
                    zIndex: 1000,
                    position: 'relative',
                    maxWidth: 'fit-content',
                    maxHeight: 'fit-content',
                    right: '10px',
                    top: '5px',
                }}>
                    <DeviceItem
                        key={deviceItemName}
                        data={deviceItem}
                        // setData={setData}
                        deviceType={deviceType}
                        showAttributes={showAttributes}
                        devicesEnclosingList={shownDevices}
                        scope={SCOPE_TRIAL}
                    />
                </Paper>
            ))}
        </TreeView>
    )
}