import { useExperiments } from "../Context/useExperiments";
import { AttributeTypeObj, DeviceOnTrialObj, ExperimentObj } from "../objects";
import { AttributeValue } from "./AttributeValue";

export const AttributeItemOnTrial = ({
  attrType,
  deviceOnTrial,
}: {
  attrType: AttributeTypeObj,
  deviceOnTrial: DeviceOnTrialObj,
}) => {
  const { setExperiment } = useExperiments();

  const deviceItem = deviceOnTrial.deviceItem;
  const editable = attrType.isEditable(deviceOnTrial);
  const setValue = (val: any) => {
    if (editable) {
      const exp = new ExperimentObj(deviceOnTrial.trial.trialType.experiment!);
      const trial = exp?.findTrial(deviceOnTrial.trial);
      const dev = trial?.findDevice(deviceOnTrial);
      if (dev) {
        dev.setAttribute(attrType, val);
      }
      setExperiment(exp.name, exp.toJson(true));
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