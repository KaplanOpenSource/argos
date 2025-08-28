import { BooleanProperty } from "../Property/BooleanProperty";
import { DateProperty } from "../Property/DateProperty";
import { DateTimeProperty } from "../Property/DateTimeProperty";
import { SelectProperty } from "../Property/SelectProperty";
import { IAttributeType } from "../types/types";
import { ValueTypeEnum } from "../types/ValueTypeEnum";
import { TextFieldDebounceOutlined } from "../Utils/TextFieldDebounce";

export const AttributeValue = ({
  type,
  label,
  data,
  setData,
  attrType,
  reduceNames = false,
  ...restProps
}: {
  type: ValueTypeEnum,
  label: string,
  data: any,
  setData: (val: any) => void,
  attrType: IAttributeType,
  reduceNames?: boolean,
} & Record<string, any>) => {
  switch (type) {
    case ValueTypeEnum.VALUE_TYPE_NUMBER:
      return (
        <TextFieldDebounceOutlined
          label={label}
          type="number"
          onChange={(val: any) => setData(val === '' ? undefined : val)}
          value={data}
          {...restProps}
        />
      )
    case ValueTypeEnum.VALUE_TYPE_BOOLEAN: {
      return (
        <BooleanProperty
          data={data}
          setData={setData}
          label={reduceNames ? '' : label}
          {...restProps}
        />
      )
    }
    case ValueTypeEnum.VALUE_TYPE_DATE:
      return (
        <DateProperty
          data={data}
          setData={setData}
          label={label}
          {...restProps}
        />
      )
    case ValueTypeEnum.VALUE_TYPE_DATE_TIME:
      return (
        <DateTimeProperty
          data={data}
          setData={setData}
          label={label}
          {...restProps}
        />
      )
    case ValueTypeEnum.VALUE_TYPE_SELECT: {
      return (
        <SelectProperty
          data={data}
          setData={setData}
          label={label}
          options={attrType.options}
          multiple={attrType.multiple}
          {...restProps}
        />
      )
    }
    default:
      if (type !== ValueTypeEnum.VALUE_TYPE_STRING) {
        console.log(`unknown attribute value type ${type} for ${label}`);
      }
      return (
        <TextFieldDebounceOutlined
          label={label}
          onChange={(val: string) => setData(val)}
          value={data || ''}
          {...restProps}
        />
      )
  }
}
