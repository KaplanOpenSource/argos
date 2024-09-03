import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material"
import { AttributeItemOne } from "./AttributeItemList";
import { SCOPE_TRIAL } from "./AttributeType";
import { Fragment } from "react";

export const TrialsTabularView = ({ data, setData }) => {
    return (
        <TableContainer component={Paper} key="1">
            <Table
                sx={{ minWidth: 650 }}
                aria-label="simple table"
                size="small"
            >
                {data?.trialTypes?.map((trialType) => (
                    <Fragment key={trialType.trackUuid}>
                        <TableHead key={':th_' + trialType.name}>
                            <TableRow sx={{ backgroundColor: 'lightgray' }}>
                                <TableCell key={':tt'}>Trial Type</TableCell>
                                <TableCell key={':tr'}>Trial</TableCell>
                                {trialType?.attributeTypes?.map(attrType => (
                                    <TableCell
                                        key={attrType.name}
                                    >
                                        {attrType.name}
                                    </TableCell>
                                ))}
                            </TableRow>
                        </TableHead>
                        <TableBody key={':tb_' + trialType.name}>
                            {trialType?.trials?.map((trial) => (
                                <TableRow
                                    key={trial.trackUuid}
                                >
                                    <TableCell component="th" scope="row" key={':tt'}>
                                        {trialType.name}
                                    </TableCell>
                                    <TableCell key={':tr'}>{trial.name}</TableCell>
                                    {trialType?.attributeTypes?.map(attrType => {
                                        const attr = trial?.attributes?.find(x => x.name === attrType.name);
                                        return attr
                                            ? (
                                                <TableCell
                                                    key={attrType.name}
                                                >
                                                    <AttributeItemOne
                                                        attrType={attrType}
                                                        data={trial}
                                                        // setData={setData}
                                                        scope={SCOPE_TRIAL}
                                                    // deviceItem={deviceItem}
                                                    />
                                                    {/* {JSON.stringify(attr.value)} */}
                                                </TableCell>
                                            )
                                            : null;
                                    })}
                                </TableRow>

                            ))}
                        </TableBody>
                    </Fragment>
                ))}
            </Table>
        </TableContainer>
    )
}