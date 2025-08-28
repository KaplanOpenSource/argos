import DeleteIcon from '@mui/icons-material/Delete';
import { IconButton } from "@mui/material";
import { TreeRowOnChosen } from "../App/TreeRowOnChosen";
import { useChosenTrial } from '../Context/useChosenTrial';
import { useExperiments } from '../Context/useExperiments';
import { ExperimentObj } from '../objects';
import { isScopeEqual, ScopeEnum } from '../types/ScopeEnum';
import { IDevice, IDeviceType, IExperiment } from "../types/types";
import { Stack3 } from '../Utils/Stack3';
import { AttributeItem } from './AttributeItem';
import { AttributeItemAcrossTrials } from './AttributeItemAcrossTrials';
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

  // console.log(data.name, isExperimentChosen(), showAttributes, deviceType.attributeTypes)
  return (
    <TreeRowOnChosen
      key={data.trackUuid}
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
            .filter(attrType => isScopeEqual(attrType.scope, ScopeEnum.SCOPE_EXPERIMENT))
            .map(attrType => {
              return (
                <AttributeItem
                  key={attrType.name}
                  attrType={attrType}
                  container={data}
                  setContainer={setData}
                />
              )
            })}
        </Stack3>
      )}

      {(deviceType.attributeTypes || [])
        .filter(attrType => isScopeEqual(attrType.scope, ScopeEnum.SCOPE_TRIAL))
        .map(attrType => {
          return (
            <AttributeItemAcrossTrials
              key={attrType.trackUuid}
              attrType={attrType}
              device={data}
              deviceType={deviceType}
              experiment={experiment}
            />
          )
        })}
    </TreeRowOnChosen>
  )
}
