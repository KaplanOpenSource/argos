import DeleteIcon from '@mui/icons-material/Delete';
import { IconButton } from "@mui/material";
import { TreeRowOnChosen } from "../App/TreeRowOnChosen";
import { useChosenTrial } from '../Context/useChosenTrial';
import { useExperiments } from '../Context/useExperiments';
import { ExperimentObj } from '../objects';
import { IDevice, IDeviceType, IExperiment, ScopeEnum } from "../types/types";
import { VALUE_TYPE_DEFAULT } from '../types/ValueTypeEnum';
import { changeByName } from '../Utils/utils';
import { AttributeValue } from './AttributeValue';
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
        <>
          {(deviceType.attributeTypes || [])
            .filter(attrType => attrType.scope !== ScopeEnum.SCOPE_TRIAL)
            .map(attrType => {
              const attr = data.attributes?.find(attr => attr.name === attrType.name);
              const value = (attr ? attr.value : attrType.defaultValue) ?? '';
              const setValue = (val: any) => {
                if (setData) {
                  const attrValue = (val === undefined) ? undefined : { name: attrType.name, value: val };
                  const attributes = changeByName(data.attributes, attrType.name!, attrValue);
                  setData({ ...data, attributes });
                }
              }
              return (
                <AttributeValue
                  key={attrType.name}
                  label={attrType.name!}
                  type={attrType.type || VALUE_TYPE_DEFAULT}
                  data={value}
                  setData={setValue}
                  attrType={attrType}
                />
              )
            })}
        </>
      )}
    </TreeRowOnChosen>
  )
}
