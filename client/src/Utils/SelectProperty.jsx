import { Box, Chip, FormControl, InputLabel, ListItemText, MenuItem, Select, Tooltip } from "@mui/material";

function makeArray(val) {
    return ((typeof val === 'string' ? val.split(',') : val) || []);
}

export const SelectProperty = ({ label, data, setData, options, multiple, tooltipTitle = "", ...restProps }) => {
    return (
        <Tooltip
            title={tooltipTitle}
            placement='top'
        >
            <FormControl sx={{ minWidth: 120 }}>
                <InputLabel>{label}</InputLabel>
                {!multiple ? (
                    <Select
                        label={label}
                        size="small"
                        value={data}
                        onChange={(e) => {
                            e.stopPropagation();
                            setData(e.target.value);
                        }}
                        {...restProps}
                    >
                        {(options || []).map(o => (
                            <MenuItem
                                key={o.name}
                                value={o.name}
                            >
                                <Tooltip
                                    title={o.tooltip}
                                    placement="top"
                                >
                                    {o.name}
                                </Tooltip>
                            </MenuItem>
                        ))}
                    </Select>
                ) : (
                    <Select
                        label={label}
                        size="small"
                        value={makeArray(data)}
                        onChange={(e) => {
                            e.stopPropagation();
                            setData(makeArray(e.target.value));
                        }}
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
                                <Tooltip
                                    title={o.tooltip}
                                    placement="top"
                                >
                                    {/* <Checkbox checked={(data || []).indexOf(o.name) > -1} /> */}
                                    <ListItemText primary={o.name} />
                                </Tooltip>
                            </MenuItem>
                        ))}
                    </Select>
                )}
            </FormControl>
        </Tooltip>
    )
}