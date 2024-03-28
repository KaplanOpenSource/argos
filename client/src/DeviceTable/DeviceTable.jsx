import { Button, Paper } from "@mui/material"
import { TreeView } from "@mui/x-tree-view/TreeView"
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import { useContext, useState } from "react";
import { experimentContext } from "../Context/ExperimentProvider";
import { DeviceItem } from "../Experiment/DeviceItem";
import { ButtonTooltip } from "../Utils/ButtonTooltip";

export const DeviceTable = ({ }) => {
    const { selection, currTrial } = useContext(experimentContext);
    const [showAttributes, setShowAttributes] = useState(false);

    const shownDevices = [];
    for (const { deviceTypeName, deviceItemName } of selection || []) {
        const deviceType = (currTrial.experiment || {}).deviceTypes.find(x => x.name === deviceTypeName);
        const deviceItem = ((deviceType || {}).devices || []).find(x => x.name === deviceItemName);
        if (deviceType && deviceItem) {
            shownDevices.push({ deviceType, deviceItem, deviceTypeName, deviceItemName });
        }
    };

    return (
        <Paper
            style={{
                zIndex: 1000,
                position: 'relative',
                maxWidth: 'fit-content',
                maxHeight: 'fit-content',
                right: 0,
                top: '-5px',
                margin: '10px',
                overflowY: 'visible'
            }}
        >
            <Button>
                Selected Devices
            </Button>
            <ButtonTooltip
                tooltip={showAttributes ? "Hide attributes" : "Show attributes"}
                onClick={() => setShowAttributes(!showAttributes)}
                color={showAttributes ? "primary" : ""}
            >
                <AccountTreeIcon />
            </ButtonTooltip>
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
                    <DeviceItem
                        key={deviceItemName}
                        data={deviceItem}
                        // setData={setData}
                        deviceType={deviceType}
                        showAttributes={showAttributes}
                        devicesEnclosingList={shownDevices}
                        scope={'Trial'}
                    />
                ))}
            </TreeView>
        </Paper>
    )
}