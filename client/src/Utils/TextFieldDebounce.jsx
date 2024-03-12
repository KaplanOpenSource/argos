import React, { useEffect, useState } from 'react';
import TextField from '@mui/material/TextField';
import debounce from 'lodash.debounce';

export const TextFieldDebounce = ({ value, onChange, debounceMs = 500, ...props }) => {
    const [innerValue, setInnerValue] = useState(value);

    // Update inner value when external value changes
    // This ensures the component stays controlled but still debounceable
    useEffect(() => {
        setInnerValue(value);
    }, [value]);

    // Create a debounced onChange function
    const debouncedOnChange = React.useMemo(() => debounce(onChange, debounceMs), [onChange, debounceMs]);

    const handleChange = (event) => {
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
        <TextField
            {...props} // Pass any additional props to the TextField
            value={innerValue}
            onChange={handleChange}
        />
    );
};

export const TextFieldDebounceOutlined = ({ ...props }) => {
    return (
        <TextFieldDebounce
            {...props}
            sx={{ padding: '5px' }}
            variant="outlined"
            size="small"
            InputLabelProps={{ shrink: true }}
        />
    )
}