import { Box, Checkbox, Chip, FormControl, InputLabel, ListItemText, MenuItem, Select } from "@mui/material";

function makeArray(val) {
    return ((typeof val === 'string' ? val.split(',') : val) || []);
}
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
        console.log('data', data)
        return (
            <FormControl>
                <InputLabel>{label}</InputLabel>
                <Select
                    value={makeArray(data)}
                    label={label}
                    onChange={(event) => setData(makeArray(event.target.value))}
                    size="small"
                    renderValue={(selected) => {
                        console.log('selected', selected)
                        return (
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0 }}>
                                {makeArray(selected).map((value) => (
                                    <Chip key={value} label={value} size="small" />
                                ))}
                            </Box>
                        )
                    }}
                    multiple
                >
                    {(options || []).map(o => (
                        <MenuItem
                            key={o.name}
                            value={o.name}
                        >
                            {/* <Checkbox checked={(data || []).indexOf(o.name) > -1} /> */}
                            <ListItemText primary={o.name} />
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
        )
    }
}