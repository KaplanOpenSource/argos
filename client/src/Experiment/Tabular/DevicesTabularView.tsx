import { Paper, Table, TableContainer } from "@mui/material";
import { useChosenTrial } from "../../Context/useChosenTrial";
import { DevicesTabularOneType } from "./DevicesTabularOneType";

export const DevicesTabularView = ({ }) => {
  const { experiment } = useChosenTrial();

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
          return (
            <DevicesTabularOneType
              key={deviceType.trackUuid}
              deviceType={deviceType}
            />
          )
        })}
      </Table>
    </TableContainer>
  )
}