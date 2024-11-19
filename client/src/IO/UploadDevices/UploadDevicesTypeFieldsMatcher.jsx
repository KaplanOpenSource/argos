import { Grid, Stack, Typography } from "@mui/material"
import { SelectProperty } from "../../Property/SelectProperty";
import { useEffect } from "react";
import { FIELD_UNASSIGNED, IGNORE_FIELDS, LOCATION_FIELDS } from "./uploadDefs";

function uniq(list) {
    return list.reduce((acc, d) => acc.includes(d) ? acc : acc.concat(d), []);
}

const UploadDevicesTypeFieldsMatcherOne = ({ oneMatch, setOneMatch, attrName, attrOptions }) => {
    const locationUnassigned = oneMatch === FIELD_UNASSIGNED && LOCATION_FIELDS.includes(attrName);
    return (
        <Grid container direction='row'>
            <Grid item xs={3} alignSelf={'center'}>
                <Typography>{attrName}</Typography>
            </Grid>
            <Grid item xs={4}>
                <SelectProperty
                    styleFormControl={{ width: '100%' }}
                    label={attrName}
                    data={oneMatch}
                    setData={v => setOneMatch(v)}
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
            {attributeTypeNames.map((attrName, i) => (
                <UploadDevicesTypeFieldsMatcherOne key={i}
                    attrName={attrName}
                    oneMatch={attrMatch[attrName] || FIELD_UNASSIGNED}
                    setOneMatch={v => setAttrMatch({ ...attrMatch, [attrName]: v })}
                    attrOptions={attrOptions}
                />
            ))}
        </Stack>
    )
}