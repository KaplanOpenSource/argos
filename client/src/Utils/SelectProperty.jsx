import { Box, Chip, FormControl, InputLabel, ListItemText, MenuItem, Select, Tooltip } from "@mui/material";

function makeArray(val) {
    return ((typeof val === 'string' ? val.split(',') : val) || []);
}
export const SelectProperty = ({ label, data, setData, options, multiple, tooltipTitle = "", ...restProps }) => {
    if (!multiple) {
        return (
            <Tooltip
                title={tooltipTitle}
                placement='top'
            >
                <FormControl>
                    <InputLabel>{label}</InputLabel>
                    <Select
                        value={data}
                        label={label}
                        onChange={(event) => {
                            setData(event.target.value);
                        }}
                        size="small"
                        {...restProps}
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
            </Tooltip>
        )
    } else {
        return (
            <Tooltip
                title={tooltipTitle}
                placement='top'
            >
                <FormControl>
                    <InputLabel>{label}</InputLabel>
                    <Select
                        value={makeArray(data)}
                        label={label}
                        onChange={(event) => setData(makeArray(event.target.value))}
                        size="small"
                        renderValue={(selected) => {
                            const sarr = makeArray(selected);
                            return (
                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                    {sarr.map((value) => (
                                        <Chip key={value} label={value} size="small" />
                                    ))}
                                </Box>
                            )
                        }}
                        multiple
                        {...restProps}
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
            </Tooltip>
        )
    }
}