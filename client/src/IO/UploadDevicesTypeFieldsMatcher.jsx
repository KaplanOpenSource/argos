import { Box, Paper, Typography } from "@mui/material"

function uniq(list) {
    return list.reduce((acc, d) => acc.includes(d) ? acc : acc.concat(d), []);
}

const IGNORE_FIELDS = ['type', 'name'];

export const UploadDevicesTypeFieldsMatcher = ({ devicesDetails, experiment }) => {
    const fieldNamesOnDetails = uniq(devicesDetails.flatMap(x => {
        return Object.keys(x.attributes).filter(f => !IGNORE_FIELDS.includes(f));
    }));

    const deviceTypeName = devicesDetails[0]?.type;

    const deviceType = experiment?.deviceTypes?.find(x => x.name === deviceTypeName);
    const attributeTypes = deviceType?.attributeTypes || []

    return (
        <Paper sx={{ margin: 1 }}>
            <Typography variant="h6" sx={{ margin: 1 }}>{deviceTypeName}</Typography>
            {!deviceType
                ? <Typography>Undefined device type</Typography>
                : <>
                    {fieldNamesOnDetails.map((x, i) => (
                        <Box key={i}>
                            <span>{x}</span>
                        </Box>
                    ))}
                    {attributeTypes.map((x, i) =>
                        <Typography key={' ' + i}>{JSON.stringify(x)}</Typography>
                    )}
                </>
            }
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