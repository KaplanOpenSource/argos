import { FormControlLabel, MenuItem, Select, Switch, TextField } from "@mui/material";
import { DateProperty } from "../Utils/DateProperty";
import { TreeRow } from "../App/TreeRow";
import { TextFieldDebounce } from "../Utils/TextFieldDebounce";

export const VALUE_TYPE_STRING = "String";
export const VALUE_TYPE_NUMBER = "Number";
export const valueTypes = [
    VALUE_TYPE_STRING,
    VALUE_TYPE_NUMBER,
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
