import { AttributeValue } from "./AttributeValue";
import { AttributeValueGet } from "./AttributeValueGet";

export const AttributeItemOne = ({
  attrType, // Type of the attribute from the container's type
  data, // data of the container (device / trial)
  setData, // set the container
  deviceItem, // device item when applicable
  scope, // scope of the using component
  reduceNames,
}) => {
  const {
    value,
    setValue,
    attrTypeScope,
    attrValueType,
    editable,
  } = AttributeValueGet({ attrType, data, setData, deviceItem, scope });
  const tooltipTitle = editable
    ? `Attribute "${attrType.name}" can be updated here on ${attrTypeScope} level`
    : `Attribute "${attrType.name}" can be updated only on ${attrTypeScope} level (this is the ${scope} level)`;
  return (
    <AttributeValue
      key={attrType.name}
      label={attrType.name}
      type={attrValueType}
      data={value}
      setData={setValue}
      attrType={attrType}
      disabled={!editable}
      tooltipTitle={tooltipTitle}
      reduceNames={reduceNames}
    />
  )
}