import { Paper } from "@mui/material"
import { TreeView } from "@mui/x-tree-view/TreeView"
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { useContext } from "react";
import { DeviceItem } from "../Experiment/DeviceItem";
import { SCOPE_TRIAL } from "../Experiment/AttributeType";
import { EnclosingListSelectionContext } from "../Experiment/EnclosedSelectionProvider";

export const DeviceTableRich = ({ shownDevices }) => {
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
