import DeleteIcon from '@mui/icons-material/Delete';
import { IconButton } from "@mui/material";
import { TreeRowOnChosen } from "../App/TreeRowOnChosen";
import { useExperimentProvider } from "../Context/ExperimentProvider";
import { useCurrTrial } from "../Context/useCurrTrial";
import { ScopeEnum } from "../types/types";
import { AttributeItemList } from "./AttributeItemList";
import { DeviceItemLocationButton } from "./DeviceItemLocationButton";
import { SelectDeviceButton } from "./SelectDeviceButton";

export const DeviceItem = ({ data, setData, deviceType, showAttributes, devicesEnclosingList, scope, experiment }) => {
  const { currTrial, deleteDevice } = useExperimentProvider();

  const { trial } = useCurrTrial({});
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
              onClick={() => deleteDevice({ experimentName: experiment.name, deviceTypeName: deviceType.name, deviceItemName: data.name })}
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
      {currTrial.experiment && showAttributes &&
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
