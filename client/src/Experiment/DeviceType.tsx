import { Visibility, VisibilityOff } from "@mui/icons-material";
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { Typography } from "@mui/material";
import { TreeRowOnChosen } from "../App/TreeRowOnChosen";
import { useExperimentProvider } from "../Context/ExperimentProvider";
import { assignUuids } from "../Context/TrackUuidUtils";
import { useExperiments } from "../Context/useExperiments";
import { useHiddenDeviceTypes } from "../Context/useHiddenDeviceTypes";
import { IconPicker } from "../Icons/IconPicker";
import { ExperimentObj } from "../objects/ExperimentObj";
import { IDeviceType, IExperiment } from "../types/types";
import { ButtonTooltip } from "../Utils/ButtonTooltip";
import { changeByName, createNewName } from "../Utils/utils";
import { AddMultipleDevices } from "./AddMultipleDevices";
import { AttributeTypesDialogButton } from "./AttributeTypesDialogButton";
import { DeviceItem } from "./DeviceItem";
import { SelectDeviceTypeButton } from "./SelectDeviceTypeButton";

export const DeviceType = ({
  data,
  setData,
  experiment,
}: {
  data: IDeviceType,
  setData: (v: IDeviceType) => void,
  experiment: IExperiment,
}) => {
  const { currTrial } = useExperimentProvider();
  const { setExperiment } = useExperiments();
  const { setDeviceTypeHidden, isDeviceTypeHidden } = useHiddenDeviceTypes();

  const devicesEnclosingList = (data.devices || []).map(item => {
    return { deviceTypeName: data.name, deviceItemName: item.name, deviceType: data, deviceItem: item };
  });

  const isHidden = isDeviceTypeHidden(data.name);

  const toggleHidden = () => {
    setDeviceTypeHidden(data.name, !isHidden);
  }

  const devicesNum = data?.devices?.length || 0;
  let placedDevices = '';
  if (currTrial?.trial) {
    let c = 0;
    for (const { deviceTypeName } of currTrial?.trial?.devicesOnTrial || []) {
      if (deviceTypeName === data.name) {
        c++;
      }
    }
    placedDevices = `${c}/${devicesNum} positioned `;
  } else {
    placedDevices = `${devicesNum} devices`;
  }

  return (
    <TreeRowOnChosen
      data={data}
      setData={setData}
      components={
        <>
          <IconPicker
            data={data.icon || ""}
            setData={val => setData({ ...data, icon: val })}
          />
          <ButtonTooltip
            tooltip="Delete device type"
            onClick={() => {
              const exp = new ExperimentObj(experiment);
              exp.deviceTypes = exp.deviceTypes.filter(d => d.name !== data.name);
              setExperiment(experiment.name, exp.toJson(true));
            }}
          >
            <DeleteIcon />
          </ButtonTooltip>
          <ButtonTooltip
            tooltip="Add new device"
            onClick={() => {
              const name = createNewName(data.devices, 'Device');
              setData({ ...data, devices: [...(data.devices || []), assignUuids({ name })] });
            }}
          >
            <AddIcon />
          </ButtonTooltip>
          <AddMultipleDevices
            deviceType={data}
            addDevices={newDevices => {
              setData({ ...data, devices: [...(data.devices || []), ...newDevices] })
            }}
          />
          <SelectDeviceTypeButton
            deviceType={data}
          />
          <AttributeTypesDialogButton
            data={data}
            setData={setData}
            isOfDevice={true}
            containers={{ experiment, deviceType: data }}
          />
          <ButtonTooltip
            tooltip={isHidden ? "Show device type" : "Hide device type"}
            onClick={toggleHidden}
          >
            {isHidden ? <VisibilityOff /> : <Visibility />}
          </ButtonTooltip>
          <Typography>
            {placedDevices}
          </Typography>
        </>
      }
    >
      {
        (data.devices || []).map(itemData => (
          <DeviceItem
            key={itemData.trackUuid || Math.random() + ""}
            data={itemData}
            setData={newData => {
              setData({ ...data, devices: changeByName(data.devices, itemData.name!, newData) });
            }}
            deviceType={data}
            showAttributes={true}
            devicesEnclosingList={devicesEnclosingList}
            experiment={experiment}
          />
        ))
      }
    </TreeRowOnChosen>
  )
}
