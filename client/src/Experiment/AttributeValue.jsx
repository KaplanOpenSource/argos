import { TextFieldDebounceOutlined } from "../Utils/TextFieldDebounce";
import { DateProperty } from "../Utils/DateProperty";
import { BooleanProperty } from "../Utils/BooleanProperty";
import { SelectProperty } from "../Utils/SelectProperty";
import { Tooltip } from "@mui/material";

export const VALUE_TYPE_STRING = "String";
export const VALUE_TYPE_NUMBER = "Number";
export const VALUE_TYPE_DATE = "Date";
export const VALUE_TYPE_BOOLEAN = "Boolean";
export const VALUE_TYPE_SELECT = "Select";
export const valueTypes = [
    VALUE_TYPE_STRING,
    VALUE_TYPE_NUMBER,
    VALUE_TYPE_BOOLEAN,
    VALUE_TYPE_DATE,
    VALUE_TYPE_SELECT,
];
export const valueTypeDefault = VALUE_TYPE_STRING;

export const AttributeValue = ({ type, label, data, setData, attrType, ...restProps }) => {
    switch (type) {
        case VALUE_TYPE_NUMBER:
            return (
                <TextFieldDebounceOutlined
                    label={label}
                    type="number"
                    onChange={val => setData(val)}
                    value={data}
                    {...restProps}
                />
            )
        case VALUE_TYPE_BOOLEAN: {
            return (
                <BooleanProperty
                    data={data}
                    setData={setData}
                    label={label}
                    {...restProps}
                />
            )
        }
        case VALUE_TYPE_DATE:
            return (
                <DateProperty
                    data={data}
                    setData={setData}
                    label={label}
                    {...restProps}
                />
            )
        case VALUE_TYPE_SELECT: {
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
            if (type !== VALUE_TYPE_STRING) {
                console.log(`unknown attribute value type ${type} for ${label}`);
            }
            return (
                <TextFieldDebounceOutlined
                    label={label}
                    onChange={val => setData(val)}
                    value={data || ''}
                    {...restProps}
                />
            )
    }
}
