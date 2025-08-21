import { ChevronRight, ExpandMore } from "@mui/icons-material";
import { TableBody, TableCell, TableHead, TableRow, Typography } from "@mui/material";
import { useState } from "react";
import { IAttributeType, IDevice, IDeviceType, IExperiment } from "../types/types";
import { ButtonTooltip } from "../Utils/ButtonTooltip";
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
  const [expanded, setExpanded] = useState(false);
  return (
    <>
      <TableHead>
        <TableRow>
          <TableCell sx={{ borderBottom: 'none' }}>
            {attrType.name}
            <ButtonTooltip
              tooltip={expanded ? "Collapse values across trials" : "Show values across trials"}
              onClick={() => setExpanded(!expanded)}
              style={{ margin: 0, padding: 0 }}
            >
              {expanded ? <ExpandMore /> : <ChevronRight />}
            </ButtonTooltip>
          </TableCell>
        </TableRow>
      </TableHead>
      {expanded &&
        <TableBody>
          {experiment.trialTypes?.flatMap(tt => tt.trials?.flatMap(trial => {
            const dev = trial.devicesOnTrial?.find(dt => isSameDeviceItem(device.name!, deviceType.name!, dt))
            if (!dev) {
              return null;
            }
            return (
              <TableRow hover>
                <TableCell sx={{ paddingY: 0, marginY: 0, borderBottom: 'none' }}>
                  <Typography>{trial.name}</Typography>
                </TableCell>
                <TableCell sx={{ paddingY: 0, marginY: 0, borderBottom: 'none' }}>
                  <AttributeItem
                    attrType={attrType}
                    container={dev}
                  // setData={setData}
                  />
                </TableCell>
              </TableRow>
            )
          }))}
        </TableBody>
      }
    </>
  )
}