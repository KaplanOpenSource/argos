import { Box, Paper, Popover, Stack, Tooltip, Typography } from "@mui/material";
import { Path } from "leaflet";
import { useState } from "react";

const DEFAULT_COLOR = new Path().options.color;

const Square = ({ fillColor, lineColor, fillOpacity, lineOpacity, side = 20, tooltipTitle, ...restProps }) => {
    // Combine color and opacity for border and background
    const backgroundColor = `${fillColor}${Math.round(fillOpacity * 255).toString(16).padStart(2, "0")}`;
    const borderColor = `${lineColor}${Math.round(lineOpacity * 255).toString(16).padStart(2, "0")}`;

    return (
        <Tooltip title={tooltipTitle} placement="top">
            <Box
                style={{
                    width: side + "px",
                    height: side + "px",
                    border: `3px solid ${borderColor}`,
                    backgroundColor: backgroundColor,
                }}
                {...restProps}
            />
        </Tooltip>
    );
};

export const ShapeColorPicker = ({ data, setData, showFill = true }) => {
    const [anchorEl, setAnchorEl] = useState(null);

    const lineColor = data?.lineColor || DEFAULT_COLOR;
    const fillColor = data?.fillColor || DEFAULT_COLOR;
    const lineOpacity = (data?.lineOpacity || 100);
    const fillOpacity = (data?.fillOpacity || 20);
    return (
        <Box sx={{ position: 'relative' }}>
            <Square
                tooltipTitle="Pick Color"
                lineColor={lineColor}
                fillColor={fillColor}
                lineOpacity={lineOpacity / 100.0}
                fillOpacity={fillOpacity / 100.0}
                onClick={(e) => {
                    e.stopPropagation();
                    setAnchorEl(anchorEl ? null : e.currentTarget);
                }}
            ></Square>

            <Popover
                open={Boolean(anchorEl)}
                anchorEl={anchorEl}
                onClose={e => {
                    e.stopPropagation();
                    setAnchorEl();
                }}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right', }}
                transformOrigin={{ vertical: 'top', horizontal: 'left', }}
                sx={{ zIndex: 1000 }}
            >
                <Paper
                    sx={{
                        border: 1, padding: 1.5,
                    }}
                    onClick={e => e.stopPropagation()}
                >
                    <Stack direction='row' spacing={1}>
                        <Typography sx={{ minWidth: '40px' }}>Line</Typography>
                        <input
                            type="range"
                            value={lineOpacity}
                            onChange={e => setData({ ...data, lineOpacity: e.target.value })}
                        />
                        <input
                            type="color"
                            value={lineColor}
                            onChange={e => setData({ ...data, lineColor: e.target.value })}
                        />
                    </Stack>
                    <Stack direction='row' spacing={1}>
                        <Typography sx={{ minWidth: '40px' }}>Fill</Typography>
                        <input
                            type="range"
                            value={fillOpacity}
                            onChange={e => setData({ ...data, fillOpacity: e.target.value })}
                        />
                        <input
                            type="color"
                            value={fillColor}
                            onChange={e => setData({ ...data, fillColor: e.target.value })}
                        />
                    </Stack>
                </Paper>
            </Popover>
        </Box >
    )
}