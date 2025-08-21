import { ChevronRight, ExpandMore } from "@mui/icons-material";
import { TableBody, TableCell, TableHead, TableRow, Typography } from "@mui/material";
import { useState } from "react";
import { useExperiments } from "../Context/useExperiments";
import { IAttributeType, IDevice, IDeviceOnTrial, IDeviceType, IExperiment, IHasAttributes } from "../types/types";
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
  const { setExperiment } = useExperiments();
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
      }
    </>
  )
}