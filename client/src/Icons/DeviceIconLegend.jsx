import { Paper, Stack, Typography } from "@mui/material"
import { experimentContext } from "../Context/ExperimentProvider";
import { useContext } from "react";
import { IconDeviceByName } from "./IconPicker";

export const DeviceIconLegend = ({ }) => {
    const { currTrial, hiddenDeviceTypes } = useContext(experimentContext);

    const deviceTypes = currTrial?.experiment?.deviceTypes || [];

    return deviceTypes.length === 0 ? null : (
        <Paper sx={{
            position: 'absolute',
            bottom: 28,
            right: 50,
            zIndex: 10000,
            padding: 1,
        }}>
            <Typography variant="h6" sx={{ textAlign: 'center' }}>Devices</Typography>
            {deviceTypes.map(deviceType => (
                <Stack
                    key={deviceType.trackUuid}
                    direction='row'
                    alignItems='center'
                    justifyContent='right'
                    spacing={1}
                >
                    <Typography variant='body1'>
                        {deviceType.name}
                    </Typography>
                    <IconDeviceByName
                        iconName={deviceType.icon}
                    />
                </Stack>
            ))}
        </Paper>
    )
}