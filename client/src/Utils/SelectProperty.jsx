import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";

export const SelectProperty = ({ label, data, setData, options, multiple }) => {
    return (
        <FormControl>
            <InputLabel>{label}</InputLabel>
            <Select
                value={data}
                label={label}
                onChange={(event) => {
                    setData(event.target.value);
                }}
                size="small"
            // renderValue={}
            >
                {(options || []).map(o => (
                    <MenuItem
                        key={o.name}
                        value={o.name}
                    >
                        {o.name}
                        {/* {attrType.multiple
                        ? <>
                            <Checkbox checked={data.indexOf(o.name) > -1} />
                            <ListItemText primary={o.name} />
                        </>
                        : o.name
                    } */}
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
    )
}