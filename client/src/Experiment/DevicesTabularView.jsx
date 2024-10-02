import { Paper, Table, TableContainer } from "@mui/material"
import { DevicesTabularOneType } from "./DevicesTabularOneType";

export const DevicesTabularView = ({ experiment, setExperimentData }) => {
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
                    const setDeviceType = (val) => {
                        const exp = structuredClone(experiment);
                        exp.deviceTypes[itt] = val;
                        setExperimentData(exp);
                    }
                    return (
                        <DevicesTabularOneType
                            key={deviceType.trackUuid}
                            deviceType={deviceType}
                            setDeviceType={setDeviceType}
                        />
                    )
                })}
            </Table>
        </TableContainer>
    )
}