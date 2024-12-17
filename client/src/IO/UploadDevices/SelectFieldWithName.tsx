import { Grid, Typography } from "@mui/material"
import { SelectProperty } from "../../Property/SelectProperty";
import { useEffect } from "react";
import { FIELD_UNASSIGNED } from "./uploadDefs";
import React from "react";

export const SelectFieldWithName = ({ oneMatch, setOneMatch, attrName, attrOptions, message, }: {
    oneMatch: string,
    setOneMatch: (updater: (prev: string) => string) => void,
    attrName: string,
    attrOptions: { name: string }[],
    message: string | undefined,
}) => {
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
                    setData={v => setOneMatch(() => v)}
                    options={attrOptions}
                />
            </Grid>
            <Grid item xs={2} alignSelf={'center'} sx={{ margin: 1, color: 'red' }}>
                {!message
                    ? null
                    : <Typography>
                        {message}
                    </Typography>
                }
            </Grid>
        </Grid>
    )
}

