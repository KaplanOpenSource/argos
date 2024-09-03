import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Tooltip } from "@mui/material"
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
                                        return (
                                            <TableCell
                                                key={attrType.name}
                                            >
                                                <AttributeItemOne
                                                    attrType={attrType}
                                                    data={trial}
                                                    // setData={setData}
                                                    scope={SCOPE_TRIAL}
                                                    // deviceItem={deviceItem}
                                                    reduceNames={true}
                                                />
                                            </TableCell>
                                        )
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