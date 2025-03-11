import { Box } from "@mui/material"
import { DeviceTableRich } from "./DeviceTableRich";
import { DeviceTableSmall } from "./DeviceTableSmall";

export const DeviceTable = ({ showAttributes }) => {
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
                />
                : <DeviceTableSmall
                />
            }
        </Box>
    )
}


