import { FormControlLabel, MenuItem, Select, Switch, TextField } from "@mui/material";
import { DateProperty } from "./DateProperty";
import { TreeRow } from "./TreeRow";

export const AttributeValue = ({ type, label, data, setData }) => {
    if (type === 'Number') {
        return (
            <TextField
                variant='outlined'
                label={label}
                type="number"
                size='small'
                InputLabelProps={{ shrink: true }}
                onChange={(e) => setData(e.target.value)}
                value={data}
            />
        )
    }
    if (type === 'String') {
        return (
            <TextField
                variant='outlined'
                label={label}
                size='small'
                InputLabelProps={{ shrink: true }}
                onChange={(e) => setData(e.target.value)}
                value={data}
            />
        )
    }
    console.log(`unknown attribute value type ${type} for ${label}`);
}
