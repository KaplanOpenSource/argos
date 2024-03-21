import { Checkbox, FormControl, InputLabel, ListItemText, MenuItem, Select } from "@mui/material";

export const SelectProperty = ({ label, data, setData, options, multiple }) => {
    if (!multiple) {
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
                >
                    {(options || []).map(o => (
                        <MenuItem
                            key={o.name}
                            value={o.name}
                        >
                            {o.name}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
        )
    } else {
        {
            return (
                <FormControl>
                    <InputLabel>{label}</InputLabel>
                    <Select
                        value={data}
                        label={label}
                        onChange={(event) => {
                            const value = event.target.value;
                            setData(typeof value === 'string' ? value.split(',') : value);
                        }}
                        size="small"
                        renderValue={v => v.join(', ')}
                        multiple
                    >
                        {(options || []).map(o => (
                            <MenuItem
                                key={o.name}
                                value={o.name}
                            >
                                <Checkbox checked={(data || []).indexOf(o.name) > -1} />
                                <ListItemText primary={o.name} />
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            )
        }
    }
}