import { Typography } from "@mui/material";
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
      <Typography>
        {attrType.name}
      </Typography>
      {experiment.trialTypes?.flatMap(tt => tt.trials?.flatMap(trial => {
        const dev = trial.devicesOnTrial?.find(dt => isSameDeviceItem(device.name!, deviceType.name!, dt))
        if (!dev) {
          return null;
        }
        return (<AttributeItem
          attrType={attrType}
          data={dev}
        // setData={setData}
        />
        )
      }))}
    </>
  )
}