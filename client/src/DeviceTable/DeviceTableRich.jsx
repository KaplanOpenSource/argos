import { Paper } from "@mui/material"
import { TreeView } from "@mui/x-tree-view/TreeView"
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { useContext } from "react";
import { DeviceItem } from "../Experiment/DeviceItem";
import { SCOPE_TRIAL } from "../Experiment/AttributeType";
import { EnclosingListSelectionContext } from "../Experiment/EnclosedSelectionProvider";
import { useDeviceSeletion } from "../Context/useDeviceSeletion";
import { experimentContext } from "../Context/ExperimentProvider";

export const DeviceTableRich = ({  }) => {
    const {
        selectionOnEnclosingUuids,
        setSelectionOnEnclosingUuids,
    } = useContext(EnclosingListSelectionContext);

    const { selection } = useDeviceSeletion();
    const { currTrial } = useContext(experimentContext);

    const shownDevices = [];
    for (const { deviceTypeName, deviceItemName } of selection || []) {
        const deviceType = ((currTrial.experiment || {}).deviceTypes || []).find(x => x.name === deviceTypeName);
        const deviceItem = ((deviceType || {}).devices || []).find(x => x.name === deviceItemName);
        if (deviceType && deviceItem) {
            shownDevices.push({ deviceType, deviceItem, deviceTypeName, deviceItemName });
        }
    };

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
