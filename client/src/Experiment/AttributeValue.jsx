import { TextFieldDebounce, TextFieldDebounceOutlined } from "../Utils/TextFieldDebounce";
import { DatePicker } from "@mui/x-date-pickers";
import dayjs from "dayjs";
import { DateProperty } from "../Utils/DateProperty";
import { FormControl, FormControlLabel, FormGroup, InputLabel, MenuItem, Select, Switch } from "@mui/material";

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
        case VALUE_TYPE_BOOLEAN: {
            return (
                <FormGroup>
                    <FormControlLabel
                        control={
                            <Switch
                                checked={data || false}
                                onChange={(e) => {
                                    e.stopPropagation();
                                    setData(!!e.target.checked);
                                }}
                            />
                        }
                        label={label}
                    />
                </FormGroup>
            )
        }
        case VALUE_TYPE_DATE:
            return (
                <DateProperty
                    data={data}
                    setData={setData}
                    label={label}
                />
            )
        case VALUE_TYPE_SELECT: {
            const id = data.name + "-select";
            const idLabel = data.name + "-select-label";
            return (
                <FormControl fullWidth>
                    <InputLabel id={idLabel}>{label}</InputLabel>
                    <Select
                        labelId={idLabel}
                        // id="demo-simple-select"
                        value={data}
                        label={label}
                        onChange={(event) => {
                            setData(event.target.value);
                        }}
                    >
                        {/* {(data.options || []).map(o => ())} */}
                        <MenuItem value={10}>Ten</MenuItem>
                        <MenuItem value={20}>Twenty</MenuItem>
                        <MenuItem value={30}>Thirty</MenuItem>
                    </Select>
                </FormControl>
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
                    value={data}
                />
            )
    }
}
