import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material"

export const TrialsTabularView = ({ data, setData }) => {
    console.log(data)
    return (
        <TableContainer component={Paper}>
            <Table
                sx={{ minWidth: 650 }}
                aria-label="simple table"
                size="small"
            >
                {data?.trialTypes?.map((trialType) => (
                    <>
                        <TableHead>
                            <TableRow sx={{ backgroundColor: 'lightgray' }}>
                                <TableCell>Trial Type</TableCell>
                                <TableCell>Trial</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {trialType?.trials?.map((trial) => (
                                <TableRow
                                    key={trial.trackUuid}
                                >
                                    <TableCell component="th" scope="row">
                                        {trialType.name}
                                    </TableCell>
                                    <TableCell >{trial.name}</TableCell>

                                </TableRow>

                            ))}
                        </TableBody>
                    </>
                ))}
            </Table>
        </TableContainer>
    )
}