import { useChosenTrial } from "../../Context/useChosenTrial";
import { DeviceItemObj, DeviceOnTrialObj, DeviceTypeObj } from "../../objects";
import { IDevice, IDeviceOnTrial, ScopeEnum } from "../../types/types";
import { AttributeItemOne } from "../AttributeItemList";

export const DevicesTabularOneAttr = ({
  attrType,
  deviceItem,
  deviceType,
}: {
  attrType: any,
  deviceItem: DeviceItemObj,
  deviceType: DeviceTypeObj,
}) => {
  const { changeTrialObj, trial, changeChosen } = useChosenTrial();

  if (trial && ((!attrType?.scope) || attrType.scope === ScopeEnum.SCOPE_TRIAL)) {
    const devindex = trial.findDeviceIndex(deviceItem.asNames());

    if (devindex !== -1) {
      const deviceOnTrial = trial.devicesOnTrial[devindex];
      const setDeviceOnTrial = (newDeviceData: IDeviceOnTrial) => {
        changeTrialObj(draft => {
          draft.devicesOnTrial[devindex] = new DeviceOnTrialObj(
            newDeviceData,
            draft.devicesOnTrial[devindex].deviceItem,
            draft);
        });
      };

      return (
        <AttributeItemOne
          attrType={attrType}
          data={deviceOnTrial}
          setData={setDeviceOnTrial}
          scope={ScopeEnum.SCOPE_TRIAL}
          deviceItem={deviceItem}
          reduceNames={true}
        />
      )
    }
  }

  const setDeviceItem = (val: IDevice) => {
    changeChosen(deviceItem, new DeviceItemObj(val, deviceType));
  }

  return (
    <AttributeItemOne
      attrType={attrType}
      data={deviceItem.toJson(true)}
      setData={val => setDeviceItem(val)}
      scope={ScopeEnum.SCOPE_EXPERIMENT}
      reduceNames={true}
    />
  )
}