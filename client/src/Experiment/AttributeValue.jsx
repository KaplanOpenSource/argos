import { FormControlLabel, MenuItem, Select, Switch, TextField } from "@mui/material";
import { DateProperty } from "../Utils/DateProperty";
import { TreeRow } from "../App/TreeRow";
import { TextFieldDebounce } from "../Utils/TextFieldDebounce";

export const AttributeValue = ({ type, label, data, setData }) => {
    if (type === 'Number') {
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
    }
    if (type === 'String') {
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
    console.log(`unknown attribute value type ${type} for ${label}`);
}
