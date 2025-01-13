import React from "react";
import { Tooltip, TooltipProps, Zoom } from "@mui/material";

export const TooltipItem = (props: TooltipProps) => {
    return (
        <Tooltip
            // title={tooltipTitle}
            placement='bottom'
            leaveDelay={0}
            enterDelay={500}
            followCursor={true}
            slots={{ transition: Zoom }}
            {...props}
        />
    )
}