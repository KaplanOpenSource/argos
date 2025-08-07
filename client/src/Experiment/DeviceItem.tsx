import DeleteIcon from '@mui/icons-material/Delete';
import { IconButton } from "@mui/material";
import { TreeRowOnChosen } from "../App/TreeRowOnChosen";
import { useChosenTrial } from '../Context/useChosenTrial';
import { useCurrTrial } from "../Context/useCurrTrial";
import { useExperiments } from '../Context/useExperiments';
import { ExperimentObj } from '../objects';
import { IDevice, IDeviceType, IExperiment, ScopeEnum } from "../types/types";
import { AttributeItemList } from "./AttributeItemList";
import { DeviceItemLocationButton } from "./DeviceItemLocationButton";
import { SelectDeviceButton } from "./SelectDeviceButton";

export const DeviceItem = ({
  data,
  setData,
  deviceType,
  showAttributes,
  devicesEnclosingList,
  scope,
  experiment,
}: {
  data: IDevice,
  setData: (v: IDevice) => void,
  deviceType: IDeviceType,
  showAttributes: boolean,
  devicesEnclosingList: any,
  scope: ScopeEnum,
  experiment: IExperiment,
}) => {
  const { trial } = useCurrTrial({});
  const { setExperiment } = useExperiments();
  const { isExperimentChosen } = useChosenTrial();
  const device = trial.getDevice(deviceType.name, data.name);

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
                  setExperiment(experiment.name, exp.toJson(true));
                }
              }}
            >
              <DeleteIcon />
            </IconButton>
          }
          <DeviceItemLocationButton
            deviceType={deviceType}
            deviceItem={data}
            // hasLocation={device.hasLocationOnMap(currTrial?.shownMapName || RealMapName)}
            surroundingDevices={devicesEnclosingList}
          />
        </>
      }
    >
      {isExperimentChosen() && showAttributes &&
        <AttributeItemList
          attributeTypes={deviceType.attributeTypes}
          data={scope === ScopeEnum.SCOPE_TRIAL ? device.onTrial() : data}
          setData={scope === ScopeEnum.SCOPE_TRIAL ? device.setOnTrial : setData}
          scope={scope}
          deviceItem={scope === ScopeEnum.SCOPE_TRIAL ? data : null}
        />
      }
    </TreeRowOnChosen>
  )
}
