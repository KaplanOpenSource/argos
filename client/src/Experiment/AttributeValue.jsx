import { TextFieldDebounce, TextFieldDebounceOutlined } from "../Utils/TextFieldDebounce";
import { DatePicker } from "@mui/x-date-pickers";
import dayjs from "dayjs";
import { DateProperty } from "../Utils/DateProperty";

export const VALUE_TYPE_STRING = "String";
export const VALUE_TYPE_NUMBER = "Number";
export const VALUE_TYPE_DATE = "Date";
export const valueTypes = [
    VALUE_TYPE_STRING,
    VALUE_TYPE_NUMBER,
    VALUE_TYPE_DATE,
];
export const valueTypeDefault = VALUE_TYPE_STRING;

export const AttributeValue = ({ type, label, data, setData }) => {
    switch (type) {
        case VALUE_TYPE_NUMBER:
            return (
                <TextFieldDebounceOutlined
                    label={label}
                    type="number"
                    onChange={val => setData(val)}
                    value={data}
                />
            )
        case VALUE_TYPE_DATE:
            return (
                <DateProperty
                    data={data}
                    setData={setData}
                    label={label}
                />
            )
        default:
            if (type !== VALUE_TYPE_STRING) {
                console.log(`unknown attribute value type ${type} for ${label}`);
            }
            return (
                <TextFieldDebounceOutlined
                    label={label}
                    onChange={val => setData(val)}
                    value={data}
                />
            )
    }
}
