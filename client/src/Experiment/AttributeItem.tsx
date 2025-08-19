import { IAttributeType, IHasAttributes } from "../types/types";
import { VALUE_TYPE_DEFAULT } from "../types/ValueTypeEnum";
import { changeByName } from "../Utils/utils";
import { AttributeValue } from "./AttributeValue";

export const AttributeItem = ({
  attrType,
  data,
  setData,
}: {
  attrType: IAttributeType,
  data: IHasAttributes,
  setData?: (v: IHasAttributes) => void,
}) => {
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
}