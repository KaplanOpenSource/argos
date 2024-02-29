import React, { useState, useEffect } from 'react';
import { TextField } from '@mui/material';

// Custom debounce hook
const useDebounce = (value, delay) => {
    // State and setters for debounced value
    const [debouncedValue, setDebouncedValue] = useState(value);

    useEffect(() => {
        // Set debouncedValue to value after the specified delay
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        // Cancel the timeout if value changes (also on component unmount)
        return () => {
            clearTimeout(handler);
        };
    }, [value, delay]); // Only re-call effect if value or delay changes

    return debouncedValue;
};

export const TextFieldDebounce = ({ value, onChange, delay = 500, ...props }) => {
    const [inputValue, setInputValue] = useState(value);
    const debouncedValue = useDebounce(inputValue, delay);

    useEffect(() => {
        // If the debounced value changes and it's different from the prop value, call onChange
        if (debouncedValue !== value) {
            onChange(debouncedValue);
        }
    }, [debouncedValue, value, onChange]);

    // Handle input change
    const handleChange = (event) => {
        setInputValue(event.target.value);
    };

    return (
        <TextField
            {...props}
            value={inputValue}
            onChange={handleChange}
        />
    );
};