import { Paper, Stack, Typography } from "@mui/material"
import { SelectDeviceButton } from "../Experiment/SelectDeviceButton";
import { DeviceItemLocationButton } from "../Experiment/DeviceItemLocationButton";

export const DeviceTableSmall = ({ shownDevices }) => {
    return (
        <Stack
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
                            surroundingDevices={shownDevices}
                        />
                    </Stack>
                </Paper>
            ))}
        </Stack>
    )
}

