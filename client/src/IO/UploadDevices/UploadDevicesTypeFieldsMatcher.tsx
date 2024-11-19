import { Grid, Stack, Typography } from "@mui/material"
import { SelectProperty } from "../../Property/SelectProperty";
import { useEffect } from "react";
import { FIELD_UNASSIGNED, IGNORE_FIELDS, LOCATION_FIELDS } from "./uploadDefs";
import React from "react";

function uniq(list) {
    return list.reduce((acc, d) => acc.includes(d) ? acc : acc.concat(d), []);
}

const UploadDevicesTypeFieldsMatcherOne = ({ oneMatch, setOneMatch, attrName, attrOptions, }: {
    oneMatch: string,
    setOneMatch: (updater: (prev: string) => string) => void,
    attrName: string,
    attrOptions: { name: string }[],
}) => {
    const locationUnassigned = oneMatch === FIELD_UNASSIGNED && LOCATION_FIELDS.includes(attrName);

    useEffect(() => {
        const defMatch = attrOptions.find(a => a.name === attrName) ? attrName : FIELD_UNASSIGNED;
        setOneMatch(() => defMatch);
    }, [])

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
                    setData={v => setOneMatch(prev => v)}
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

export const UploadDevicesTypeFieldsMatcher = ({ devicesDetails, deviceType, attrMatch, setAttrMatch }: {
    devicesDetails: { attributes: { [key: string]: any } }[],
    deviceType: { attributeTypes: { name: string }[] },
    attrMatch: { [key: string]: string },
    setAttrMatch: (updater: (prev: { [key: string]: string }) => { [key: string]: string }) => void,
}) => {
    const fieldNamesOnDetails = uniq(devicesDetails.flatMap(x => {
        return Object.keys(x.attributes).filter(f => !IGNORE_FIELDS.includes(f));
    }));

    const attributeTypeNames = deviceType?.attributeTypes?.map(x => x.name) || [];
    attributeTypeNames.unshift(...LOCATION_FIELDS);

    const attrOptions = fieldNamesOnDetails.map(f => ({ name: f }));
    attrOptions.push({ name: FIELD_UNASSIGNED });

    return (
        <Stack direction='column' spacing={1} sx={{ margin: 1 }}>
            {attributeTypeNames.map((attrName, i) => (
                <UploadDevicesTypeFieldsMatcherOne key={i}
                    attrName={attrName}
                    oneMatch={attrMatch[attrName] || FIELD_UNASSIGNED}
                    setOneMatch={updater => {
                        setAttrMatch(prev => ({ ...(prev || {}), [attrName]: updater((prev || {})[attrName]) }));
                    }}
                    attrOptions={attrOptions}
                />
            ))}
        </Stack>
    )
}