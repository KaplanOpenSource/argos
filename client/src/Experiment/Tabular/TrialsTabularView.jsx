import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Tooltip, Typography } from "@mui/material"
import { AttributeItemOne } from "../AttributeItemList";
import { SCOPE_TRIAL } from "../AttributeType";
import { Fragment } from "react";
import { DateProperty } from "../../Property/DateProperty";
import { sum } from "lodash";
import { AttributeTypesDialogButton } from "../AttributeTypesDialogButton";
import { AddNewTrialButton } from "../AddNewTrialButton";

export const TrialsTabularView = ({ data, setData }) => {
    const totalDevices = sum((data?.deviceTypes || []).map(x => (x?.devices || []).length));
    return (
        <TableContainer
            component={Paper}
            key="1"
        >
            <Table
                size="small"
                stickyHeader
            >
                {data?.trialTypes?.map((trialType, itt) => {
                    const setTrialType = (val) => {
                        const exp = structuredClone(data);
                        exp.trialTypes[itt] = val;
                        setData(exp);
                    }
                    return (
                        <Fragment key={trialType.trackUuid}>
                            <TableHead key={':th_' + trialType.name}>
                                <TableRow
                                    sx={{
                                        backgroundColor: 'lightgray'
                                    }}
                                >
                                    <TableCell key={':tt'}>
                                        Trial Type
                                        <AttributeTypesDialogButton
                                            data={trialType}
                                            setData={val => setTrialType(val)}
                                            isOfDevice={false}
                                        />
                                    </TableCell>
                                    <TableCell key={':tr'}>
                                        Trial
                                        <AddNewTrialButton
                                            trialType={trialType}
                                            setTrialType={val => setTrialType(val)}
                                        />
                                    </TableCell>
                                    <TableCell key={':tcd'}>Created Date</TableCell>
                                    <TableCell key={':tpos'}>Positioned Devices</TableCell>
                                    {trialType?.attributeTypes?.map(attrType => {
                                        let shortName = attrType.name;
                                        if (shortName.length > 20) {
                                            shortName = shortName.substring(0, 5) + '..' + shortName.substring(shortName.length - 8);
                                        }
                                        return (
                                            <Tooltip
                                                key={attrType.name}
                                                title={attrType.name}
                                            >
                                                <TableCell
                                                    key={attrType.name}
                                                >
                                                    {shortName}
                                                </TableCell>
                                            </Tooltip>
                                        )
                                    })}
                                </TableRow>
                            </TableHead>
                            <TableBody key={':tb_' + trialType.name}>
                                {trialType?.trials?.map((trial, itr) => {
                                    const placedDevices = (trial.devicesOnTrial || []).length;
                                    const setTrial = (val) => {
                                        const exp = structuredClone(data);
                                        exp.trialTypes[itt].trials[itr] = val;
                                        setData(exp);
                                    }
                                    return (
                                        <TableRow
                                            key={trial.trackUuid}
                                        >
                                            <TableCell component="th" scope="row" key={':tt'}>
                                                {trialType.name}
                                            </TableCell>
                                            <TableCell key={':tr'}>{trial.name}</TableCell>
                                            <TableCell key={':tcd'}>
                                                <DateProperty
                                                    data={trial.createdDate}
                                                    // setData={val => setData({ ...data, createdDate: val })}
                                                    label="Created Date"
                                                    disabled={true}
                                                />
                                            </TableCell>
                                            <TableCell key={':tpos'}>
                                                <Typography>
                                                    {placedDevices}/{totalDevices}
                                                </Typography>
                                            </TableCell>
                                            {trialType?.attributeTypes?.map(attrType => {
                                                return (
                                                    <TableCell
                                                        key={attrType.name}
                                                    >
                                                        <AttributeItemOne
                                                            attrType={attrType}
                                                            data={trial}
                                                            setData={val => setTrial(val)}
                                                            scope={SCOPE_TRIAL}
                                                            reduceNames={true}
                                                        />
                                                    </TableCell>
                                                )
                                            })}
                                        </TableRow>

                                    )
                                })}
                            </TableBody>
                        </Fragment>
                    )
                })}
            </Table>
        </TableContainer>
    )
}