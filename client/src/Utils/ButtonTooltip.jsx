import React from 'react';
import {
    IconButton,
    Tooltip,
} from '@mui/material';
import { DomEvent } from 'leaflet';

export const ButtonTooltip = ({ onClick, tooltip, disabled, children, ...restProps }) => {
    const button = (
        <IconButton
            size="small"
            onClick={(e) => {
                DomEvent.stop(e);
                onClick(e)
            }}
            disabled={disabled}
            {...restProps}
        >
            {children}
        </IconButton>
    );
    return (
        <Tooltip title={tooltip}>
            {disabled
                ? <span>{button}</span>
                : button
            }
        </Tooltip>
    )
}

