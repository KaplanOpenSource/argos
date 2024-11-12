import { Box, Paper, Typography } from "@mui/material"

export const UploadDevicesTypeFieldsMatcher = ({ devicesDetails }) => {
    return (
        <Paper sx={{ margin: 1 }}>
            <Typography variant="h6" sx={{ margin: 1 }}>{devicesDetails[0]?.type}</Typography>
            {devicesDetails.map((devItem, i) => (
                <Box key={i}>
                    <Typography variant="h6" sx={{ margin: 1 }}>{devItem.name}</Typography>
                    {/* <Typography variant="h6" sx={{ margin: 1 }}>{devItem.name}</Typography> */}
                    {JSON.stringify(devItem)}
                </Box>
            ))}
        </Paper>
    )
}