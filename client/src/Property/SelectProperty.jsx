import { Box, Chip, FormControl, InputLabel, ListItemText, MenuItem, Select, Tooltip } from "@mui/material";


export const SelectProperty = ({ label, data, setData, options, multiple = false, tooltipTitle = "", ...restProps }) => {
    function makeArray(val) {
        return ((typeof val === 'string' ? val.split(',') : val) || []);
    }

    const handleChange = (e) => {
        e.stopPropagation();
        if (multiple) {
            setData(makeArray(e.target.value));
        } else {
            setData(e.target.value);
        }
    };

    const value = multiple ? makeArray(data) : (data || '');

    const renderValueMultiple = (selected) => {
        const sarr = makeArray(selected);
        return (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                {sarr.map((value) => (
                    <Chip key={value} label={value} size="small" />
                ))}
            </Box>
        )
    }

    return (
        <Tooltip
            title={tooltipTitle}
            placement='top'
        >
            <FormControl sx={{ minWidth: 120 }}>
                <InputLabel>{label}</InputLabel>
                <Select
                    key={multiple} // this is needed because the changing multiple causes crush
                    label={label}
                    size="small"
                    value={value}
                    onChange={handleChange}
                    onClose={e => e.stopPropagation()}
                    renderValue={!multiple ? undefined : renderValueMultiple}
                    multiple={multiple}
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
                                {!multiple
                                    ? (
                                        <span>{o.name}</span>
                                    )
                                    : (
                                        // {/* <Checkbox checked={(data || []).indexOf(o.name) > -1} /> */ }
                                        <ListItemText primary={o.name} />
                                    )}
                            </Tooltip>
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
        </Tooltip>
    )
}