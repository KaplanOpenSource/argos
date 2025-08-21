import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import { IAttributeType, IDevice, IDeviceType, IExperiment } from "../types/types";
import { isSameDeviceItem } from "../Utils/isSameDevice";
import { AttributeItem } from "./AttributeItem";

export const AttributeItemAcrossTrials = ({
  attrType,
  device,
  deviceType,
  experiment,
}: {
  attrType: IAttributeType,
  device: IDevice,
  deviceType: IDeviceType,
  experiment: IExperiment,
}) => {
  return (
    <>
      <TableContainer component={Paper}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>
                {attrType.name}
              </TableCell>
              <TableCell></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {experiment.trialTypes?.flatMap(tt => tt.trials?.flatMap(trial => {
              const dev = trial.devicesOnTrial?.find(dt => isSameDeviceItem(device.name!, deviceType.name!, dt))
              if (!dev) {
                return null;
              }
              return (
                <TableRow hover>
                  <TableCell sx={{ paddingY: 0, marginY: 0 }}>
                    <Typography>{trial.name}</Typography>
                  </TableCell>
                  <TableCell sx={{ paddingY: 0, marginY: 0 }}>
                    <AttributeItem
                      attrType={attrType}
                      data={dev}
                    // setData={setData}
                    />
                  </TableCell>
                </TableRow>
              )
            }))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  )
}