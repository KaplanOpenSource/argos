import { Box } from "@mui/material"
import { useContext } from "react";
import { experimentContext } from "../Context/ExperimentProvider";
import { useDeviceSeletion } from "../Context/useDeviceSeletion";
import { DeviceTableRich } from "./DeviceTableRich";
import { DeviceTableSmall } from "./DeviceTableSmall";

export const DeviceTable = ({ showAttributes }) => {
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
        <Box sx={{
            zIndex: 1000,
            height: '80vh',
            maxWidth: '50%',
            width: 'fit-content',
            overflowY: 'auto',
            pointerEvents: 'all',
        }}>
            {showAttributes
                ? <DeviceTableRich
                    shownDevices={shownDevices}
                />
                : <DeviceTableSmall
                    shownDevices={shownDevices}
                />
            }
        </Box>
    )
}


