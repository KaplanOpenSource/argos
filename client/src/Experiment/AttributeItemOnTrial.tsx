import { useChosenTrial } from "../Context/useChosenTrial";
import { AttributeTypeObj, DeviceOnTrialObj } from "../objects";
import { AttributeValue } from "./AttributeValue";

export const AttributeItemOnTrial = ({
  attrType,
  deviceOnTrial,
}: {
  attrType: AttributeTypeObj,
  deviceOnTrial: DeviceOnTrialObj,
}) => {
  const { changeTrialObj } = useChosenTrial();

  const deviceItem = deviceOnTrial.deviceItem;
  const editable = attrType.isEditable(deviceOnTrial);
  const setValue = (val: any) => {
    if (editable) {
      changeTrialObj(draft => {
        const dev = draft.findDevice(deviceOnTrial);
        if (dev) {
          dev.setAttribute(attrType, val);
        }
      });
    }
  }

  return (
    <AttributeValue
      key={attrType.name}
      label={attrType.name}
      type={attrType.type}
      attrType={attrType}
      data={deviceItem.getAttributeValue(attrType, deviceOnTrial.trial, deviceOnTrial)}
      setData={setValue}
      disabled={!editable}
      tooltipTitle={attrType.tooltip(deviceOnTrial)}
    />
  )
}