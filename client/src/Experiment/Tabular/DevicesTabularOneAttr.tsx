import { useExperimentProvider } from "../../Context/ExperimentProvider";
import { useChosenTrial } from "../../Context/useChosenTrial";
import { DeviceItemObj, DeviceOnTrialObj, DeviceTypeObj } from "../../objects";
import { ScopeEnum } from "../../types/types";
import { AttributeItemOne } from "../AttributeItemList";

export const DevicesTabularOneAttr = ({
  attrType,
  deviceItem,
  deviceType,
  setDeviceItem,
}: {
  attrType: any,
  deviceItem: DeviceItemObj,
  deviceType: DeviceTypeObj,
  setDeviceItem: any,
}) => {
  const { currTrial, setTrialData } = useExperimentProvider();
  const { changeTrialObj } = useChosenTrial();

  if ((!attrType?.scope) || attrType.scope === ScopeEnum.SCOPE_TRIAL) {
    const devicesOnTrial = currTrial?.trial?.devicesOnTrial;
    const devindex = (devicesOnTrial || []).findIndex(t => {
      return t.deviceItemName === deviceItem.name && t.deviceTypeName === deviceType.name;
    });

    if (devindex !== -1) {
      const deviceOnTrial = devicesOnTrial![devindex];
      const setDeviceOnTrial = newDeviceData => {
        changeTrialObj(draft => {
          draft.devicesOnTrial[devindex] = new DeviceOnTrialObj(
            newDeviceData,
            draft.devicesOnTrial[devindex]?.deviceItem!,
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

  return (
    <AttributeItemOne
      attrType={attrType}
      data={deviceItem}
      setData={val => setDeviceItem(val)}
      scope={ScopeEnum.SCOPE_EXPERIMENT}
      reduceNames={true}
    />
  )
}