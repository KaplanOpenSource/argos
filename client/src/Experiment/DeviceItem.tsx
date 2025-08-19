import DeleteIcon from '@mui/icons-material/Delete';
import { IconButton } from "@mui/material";
import { TreeRowOnChosen } from "../App/TreeRowOnChosen";
import { useChosenTrial } from '../Context/useChosenTrial';
import { useExperiments } from '../Context/useExperiments';
import { ExperimentObj } from '../objects';
import { IDevice, IDeviceType, IExperiment, ScopeEnum } from "../types/types";
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
    </TreeRowOnChosen>
  )
}
