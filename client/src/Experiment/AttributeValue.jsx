import { FormControlLabel, MenuItem, Select, Switch, TextField } from "@mui/material";
import { DateProperty } from "../Utils/DateProperty";
import { TreeRow } from "../App/TreeRow";
import { TextFieldDebounce } from "../Utils/TextFieldDebounce";
import { DatePicker } from "@mui/x-date-pickers";
import dayjs from "dayjs";

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
                <TextFieldDebounce
                    sx={{ padding: '5px' }}
                    variant='outlined'
                    label={label}
                    type="number"
                    size='small'
                    InputLabelProps={{ shrink: true }}
                    onChange={val => setData(val)}
                    value={data}
                />
            )
        case VALUE_TYPE_DATE:
            return (
                <DatePicker
                    label={label}
                    slotProps={{
                        textField: {
                            fullWidth: false, size: 'small',
                            inputProps: {
                                style: {
                                    width: '100px'
                                }
                            }
                        }
                    }}
                    format='DD/MM/YYYY'
                    value={dayjs(data)}
                    onChange={(val) => setData(val)}
                />
            )
        default:
            if (type !== VALUE_TYPE_STRING) {
                console.log(`unknown attribute value type ${type} for ${label}`);
            }
            return (
                <TextFieldDebounce
                    sx={{ padding: '5px' }}
                    variant='outlined'
                    label={label}
                    size='small'
                    InputLabelProps={{ shrink: true }}
                    onChange={val => setData(val)}
                    value={data}
                />
            )
    }
}
