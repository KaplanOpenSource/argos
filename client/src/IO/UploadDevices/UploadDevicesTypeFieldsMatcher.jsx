import { Grid, Stack, Typography } from "@mui/material"
import { SelectProperty } from "../../Property/SelectProperty";
import { useEffect } from "react";
import { FIELD_UNASSIGNED, IGNORE_FIELDS, LOCATION_FIELDS } from "./uploadDefs";

function uniq(list) {
    return list.reduce((acc, d) => acc.includes(d) ? acc : acc.concat(d), []);
}

export const UploadDevicesTypeFieldsMatcher = ({ devicesDetails, deviceType, attrMatch, setAttrMatch }) => {
    const fieldNamesOnDetails = uniq(devicesDetails.flatMap(x => {
        return Object.keys(x.attributes).filter(f => !IGNORE_FIELDS.includes(f));
    }));

    const attributeTypeNames = deviceType?.attributeTypes?.map(x => x.name) || [];
    attributeTypeNames.unshift(...LOCATION_FIELDS);

    useEffect(() => {
        const matches = {};
        for (const attr of attributeTypeNames) {
            matches[attr] = fieldNamesOnDetails.includes(attr) ? attr : FIELD_UNASSIGNED;
        }
        setAttrMatch(matches);
    }, [])

    const attrOptions = fieldNamesOnDetails.map(f => ({ name: f }));
    attrOptions.push({ name: FIELD_UNASSIGNED });

    return (
        <Stack direction='column' spacing={1} sx={{ margin: 1 }}>
            {attributeTypeNames.map((attrName, i) => {
                const oneMatch = attrMatch[attrName] || FIELD_UNASSIGNED;
                const locationUnassigned = oneMatch === FIELD_UNASSIGNED && LOCATION_FIELDS.includes(attrName);
                return (
                    <Grid container direction='row' key={i}>
                        <Grid item xs={3} alignSelf={'center'}>
                            <Typography key={'a' + i}>{attrName}</Typography>
                        </Grid>
                        <Grid item xs={4}>
                            <SelectProperty
                                styleFormControl={{ width: '100%' }}
                                label={attrName}
                                data={attrMatch[attrName] || FIELD_UNASSIGNED}
                                setData={v => setAttrMatch({ ...attrMatch, [attrName]: v })}
                                options={attrOptions}
                            />
                        </Grid>
                        <Grid item xs={2} alignSelf={'center'} sx={{ margin: 1, color: 'red' }}>
                            {!locationUnassigned ? null :
                                <Typography>Assign location fields</Typography>
                            }
                        </Grid>
                    </Grid>
                )
            })}
        </Stack>
    )
}