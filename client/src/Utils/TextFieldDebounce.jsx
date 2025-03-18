import React, { useEffect, useState } from 'react';
import TextField from '@mui/material/TextField';
import debounce from 'lodash.debounce';
import { Tooltip } from '@mui/material';

export const TextFieldDebounce = ({ value, onChange = (_val) => { }, debounceMs = 500, tooltipTitle = "", ...props }) => {
    const [innerValue, setInnerValue] = useState(value);

    // Update inner value when external value changes
    // This ensures the component stays controlled but still debounceable
    useEffect(() => {
        setInnerValue(value);
    }, [value]);

    // Create a debounced onChange function
    const debouncedOnChange = React.useMemo(() => {
        return debounce(onChange, debounceMs);
    }, [onChange, debounceMs]);

    const handleChange = (event) => {
        event.stopPropagation();
        setInnerValue(event.target.value); // Update local state for immediate feedback
        debouncedOnChange(event.target.value); // Pass the value to the debounced onChange
    };

    // Cleanup the debounced function on component unmount
    useEffect(() => {
        return () => {
            debouncedOnChange.cancel();
        };
    }, [debouncedOnChange]);

    return (
        <Tooltip
            title={tooltipTitle}
            placement='bottom'
        >
            <TextField
                {...props} // Pass any additional props to the TextField
                value={innerValue === undefined ? "" : innerValue}
                onChange={handleChange}
                onClick={e => e.stopPropagation()}
                onMouseDown={e => e.stopPropagation()}
                onDoubleClick={e => e.stopPropagation()}
            />
        </Tooltip>
    );
};

export const TextFieldDebounceOutlined = ({ ...props }) => {
    return (
        <TextFieldDebounce
            {...props}
            sx={{
                paddingTop: '5px',
                paddingBottom: '5px',
                ...(props.sx || {})
            }}
            variant="outlined"
            size="small"
            InputLabelProps={{ shrink: true }}
        />
    )
}