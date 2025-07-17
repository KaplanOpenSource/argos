import { Paper, Table, TableContainer } from "@mui/material";
import { IDeviceType, IExperiment } from "../../types/types";
import { DevicesTabularOneType } from "./DevicesTabularOneType";

export const DevicesTabularView = ({
  experiment,
  setExperimentData,
}: {
  experiment: IExperiment,
  setExperimentData: (exp: IExperiment) => void,
}) => {
  return (
    <TableContainer
      component={Paper}
      key="1"
      sx={{ overflowX: "visible" }}
    >
      <Table
        size="small"
        stickyHeader
      >
        {experiment?.deviceTypes?.map((deviceType, itt) => {
          const setDeviceType = (val: IDeviceType) => {
            const exp = structuredClone(experiment);
            exp!.deviceTypes![itt] = val;
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