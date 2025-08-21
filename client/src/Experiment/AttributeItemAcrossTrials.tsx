import { Table, TableBody, TableCell, TableContainer, TableRow, Typography } from "@mui/material";
import { TreeItem } from "@mui/x-tree-view";
import { useExperiments } from "../Context/useExperiments";
import { IAttributeType, IDevice, IDeviceOnTrial, IDeviceType, IExperiment, IHasAttributes } from "../types/types";
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
  const { setExperiment } = useExperiments();
  return (
    <TreeItem
      key={device.trackUuid + '_' + attrType.trackUuid}
      nodeId={device.trackUuid + '_' + attrType.trackUuid}
      label={attrType.name}
    >
      <TableContainer sx={{ paddingTop: 1 }}>
        <Table size="small">
          <TableBody>
            {experiment.trialTypes?.flatMap((tt, itt) => tt.trials?.flatMap((trial, itrial) => {
              const idev = (trial.devicesOnTrial || []).findIndex(dt => isSameDeviceItem(device.name!, deviceType.name!, dt))
              if (idev === -1) {
                return null;
              }
              const dev = trial.devicesOnTrial![idev];
              const setDev = (v: IHasAttributes) => {
                const e = structuredClone(experiment);
                e.trialTypes![itt].trials![itrial].devicesOnTrial![idev] = v as IDeviceOnTrial;
                setExperiment(experiment.name!, e);
              }
              return (
                <TableRow hover key={trial.name}>
                  <TableCell sx={{ paddingY: 0, marginY: 0, borderBottom: 'none' }}>
                    <Typography>{trial.name}</Typography>
                  </TableCell>
                  <TableCell sx={{ paddingY: 0, marginY: 0, borderBottom: 'none' }}>
                    <AttributeItem
                      attrType={attrType}
                      container={dev}
                      setContainer={setDev}
                    />
                  </TableCell>
                </TableRow>
              )
            }))}
          </TableBody>
        </Table>
      </TableContainer>
    </TreeItem>
  )
}