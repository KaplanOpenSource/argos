import { Box, Paper, Typography } from "@mui/material"

function uniq(list) {
    return list.reduce((acc, d) => acc.includes(d) ? acc : acc.concat(d), []);
}

const IGNORE_FIELDS = ['type', 'name'];

export const UploadDevicesTypeFieldsMatcher = ({ devicesDetails, deviceType, experiment }) => {
    const fieldNamesOnDetails = uniq(devicesDetails.flatMap(x => {
        return Object.keys(x.attributes).filter(f => !IGNORE_FIELDS.includes(f));
    }));

    const attributeTypeNames = deviceType?.attributeTypes?.map(x => x.name) || []

    return (
        <Paper sx={{ margin: 1 }}>
            <Typography variant="h6" sx={{ margin: 1 }}>{deviceType?.name}</Typography>
            {fieldNamesOnDetails.map((x, i) => (
                <Box key={i}>
                    <span>{x}</span>
                </Box>
            ))}
            {attributeTypeNames.map((x, i) =>
                <Typography key={' ' + i}>{x}</Typography>
            )}
        </Paper>
    )
}