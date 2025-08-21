import DeleteIcon from '@mui/icons-material/Delete';
import { IconButton, Stack, Typography } from "@mui/material";
import { TreeRowOnChosen } from "../App/TreeRowOnChosen";
import { useChosenTrial } from '../Context/useChosenTrial';
import { useExperiments } from '../Context/useExperiments';
import { ExperimentObj } from '../objects';
import { IDevice, IDeviceType, IExperiment, ScopeEnum } from "../types/types";
import { isSameDeviceItem } from '../Utils/isSameDevice';
import { Stack3 } from '../Utils/Stack3';
import { AttributeItem } from './AttributeItem';
import { DeviceItemLocationButton } from "./DeviceItemLocationButton";
import { SelectDeviceButton } from "./SelectDeviceButton";

export const DeviceItem = ({
  data,
  setData,
  deviceType,
  showAttributes,
  devicesEnclosingList,
  experiment,
}: {
  data: IDevice,
  setData?: (v: IDevice) => void,
  deviceType: IDeviceType,
  showAttributes: boolean,
  devicesEnclosingList: any,
  experiment: IExperiment,
}) => {
  const { setExperiment } = useExperiments();
  const { isExperimentChosen } = useChosenTrial();

  return (
    <TreeRowOnChosen
      data={data}
      components={
        <>
          <SelectDeviceButton
            deviceItem={data}
            deviceType={deviceType}
            devicesEnclosingList={devicesEnclosingList}
          />
          {setData && experiment &&
            <IconButton
              size="small"
              onClick={() => {
                const exp = new ExperimentObj(experiment);
                const devtype = exp.deviceTypes.find(dt => dt.name === deviceType.name);
                if (devtype) {
                  devtype.devices = devtype.devices.filter(d => d.name !== data.name);
                  setExperiment(experiment.name!, exp.toJson(true));
                }
              }}
            >
              <DeleteIcon />
            </IconButton>
          }
          <DeviceItemLocationButton
            deviceType={deviceType}
            deviceItem={data}
            surroundingDevices={devicesEnclosingList}
          />
        </>
      }
    >
      {isExperimentChosen() && showAttributes && (
        <Stack3>
          {(deviceType.attributeTypes || [])
            .filter(attrType => attrType.scope === ScopeEnum.SCOPE_EXPERIMENT)
            .map(attrType => {
              return (
                <AttributeItem
                  key={attrType.name}
                  attrType={attrType}
                  data={data}
                  setData={setData}
                />
              )
            })}
        </Stack3>
      )}

      {/* TODO: show for each attribute, all the values it has on every trial */}

      <Stack direction='column' sx={{ justifyContent: "flex-start", alignItems: "flex-start" }}>
        {(deviceType.attributeTypes || [])
          .filter(attrType => attrType.scope === ScopeEnum.SCOPE_TRIAL)
          .map(attrType => {
            return (
              <>
                <Typography>
                  {attrType.name}
                </Typography>
                {experiment.trialTypes?.flatMap(tt => tt.trials?.flatMap(trial => {
                  const dev = trial.devicesOnTrial?.find(dt => isSameDeviceItem(data.name!, deviceType.name!, dt))
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
          })}
      </Stack>
    </TreeRowOnChosen>
  )
}
