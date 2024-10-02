import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Tooltip, Typography } from "@mui/material"
import { AttributeItemOne } from "./AttributeItemList";
import { SCOPE_EXPERIMENT, SCOPE_TRIAL } from "./AttributeType";
import { Fragment } from "react";
import { DateProperty } from "../Property/DateProperty";
import { sum } from "lodash";
import { AttributeTypesDialogButton } from "./AttributeTypesDialogButton";
import { AddNewTrialButton } from "./AddNewTrialButton";

export const DevicesTabularView = ({ experiment, setExperimentData }) => {
    // const totalDevices = sum((experiment?.deviceTypes || []).map(x => (x?.devices || []).length));
    return (
        <TableContainer
            component={Paper}
            key="1"
        >
            <Table
                size="small"
                stickyHeader
            >
                {experiment?.deviceTypes?.map((deviceType, itt) => {
                    // const setTrialType = (val) => {
                    //     const exp = structuredClone(experiment);
                    //     exp.trialTypes[itt] = val;
                    //     setExperimentData(exp);
                    // }
                    return (
                        <Fragment key={deviceType.trackUuid}>
                            <TableHead key={':th_' + deviceType.name}>
                                <TableRow
                                    sx={{
                                        backgroundColor: 'lightgray'
                                    }}
                                >
                                    <TableCell key={':tt'}>
                                        Device Type
                                        {/* <AttributeTypesDialogButton
                                            data={trialType}
                                            setData={val => setTrialType(val)}
                                            isOfDevice={false}
                                        /> */}
                                    </TableCell>
                                    <TableCell key={':tr'}>
                                        Device
                                        {/* <AddNewTrialButton
                                            trialType={trialType}
                                            setTrialType={val => setTrialType(val)}
                                        /> */}
                                    </TableCell>
                                    {/* <TableCell key={':tcd'}>Created Date</TableCell>
                                    <TableCell key={':tpos'}>Positioned Devices</TableCell> */}
                                    {deviceType?.attributeTypes?.map(attrType => {
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
                            <TableBody key={':tb_' + deviceType.name}>
                                {deviceType?.devices?.map((device, itr) => {
                                    // const placedDevices = (trial.devicesOnTrial || []).length;
                                    const setDevice = (val) => {
                                        const exp = structuredClone(experiment);
                                        exp.deviceTypes[itt].devices[itr] = val;
                                        setExperimentData(exp);
                                    }
                                    return (
                                        <TableRow
                                            key={device.trackUuid}
                                        >
                                            <TableCell component="th" scope="row" key={':tt'}>
                                                {deviceType.name}
                                            </TableCell>
                                            <TableCell key={':tr'}>{device.name}</TableCell>
                                            {/* <TableCell key={':tcd'}>
                                                <DateProperty
                                                    data={trial.createdDate}
                                                    // setData={val => setData({ ...data, createdDate: val })}
                                                    label="Created Date"
                                                    disabled={true}
                                                />
                                            </TableCell> */}
                                            {/* <TableCell key={':tpos'}>
                                                <Typography>
                                                    {placedDevices}/{totalDevices}
                                                </Typography>
                                            </TableCell> */}
                                            {deviceType?.attributeTypes?.map(attrType => {
                                                return (
                                                    <TableCell
                                                        key={attrType.name}
                                                    >
                                                        <AttributeItemOne
                                                            attrType={attrType}
                                                            data={device}
                                                            setData={val => setDevice(val)}
                                                            scope={SCOPE_EXPERIMENT}
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