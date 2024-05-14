import React, { useRef } from 'react';
import {
    IconButton,
    Tooltip,
} from '@mui/material';
import { DomEvent } from 'leaflet';

export const ButtonTooltip = ({ onClick, tooltip, disabled, closeTooltipOnClick, children, ...restProps }) => {
    const [open, setOpen] = React.useState(false);

    const button = (
        <IconButton
            size="small"
            onClick={(e) => {
                DomEvent.stop(e);
                if (closeTooltipOnClick) {
                    setOpen(false);
                }
                onClick(e);
            }}
            disabled={disabled}
            {...restProps}
        >
            {children}
        </IconButton>
    );

    return (
        <Tooltip
            open={open}
            onOpen={() => setOpen(true)}
            onClose={() => setOpen(false)}
            title={tooltip}
            arrow={true}
        >
            {/* {disabled
                ?  */}
            <div style={{ display: 'inline-block' }}>{button}</div>
            {/* : button
            } */}
        </Tooltip>
    )
}

