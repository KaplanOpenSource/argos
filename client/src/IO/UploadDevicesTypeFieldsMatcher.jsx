import { Box, Grid, Paper, Stack, Typography } from "@mui/material"
import { SelectProperty } from "../Property/SelectProperty";

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
        <Stack direction='column' spacing={1} sx={{ margin: 1 }}>
            {attributeTypeNames.map((x, i) => (
                <Grid container direction='row' key={i}>
                    <Grid item xs={3} alignSelf={'center'}>
                        <Typography key={'a' + i}>{x}</Typography>
                    </Grid>
                    <Grid item xs={4}>
                        <SelectProperty
                            styleFormControl={{ width: '100%' }}
                            label={x}
                            data={""} //type || "Polyline"}
                            setData={newtype => { }}//setType(newtype)}
                            options={fieldNamesOnDetails.map(f => ({ name: f }))}
                        />
                    </Grid>
                </Grid>
            ))}
        </Stack>
    )
    //     // <Paper sx={{ margin: 1 }}>
    //         {/* <Typography variant="h6" sx={{ margin: 1 }}>{deviceType?.name}</Typography> */}
    //         {/* {fieldNamesOnDetails.map((x, i) => (
    //             <Box key={i + 'f'}>
    //                 <span>{x}</span>
    //             </Box>
    //         ))} */}
    // // </Paper>
}