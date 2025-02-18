import * as fa_all from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Box, ImageList, ImageListItem, Paper, Popover, Stack, Tooltip, Typography } from "@mui/material";
import { Fragment, useState } from "react";
import { TextFieldDebounceOutlined } from "../Utils/TextFieldDebounce";
import { iconsCategories } from "./iconsCategories";

export const MARKER_DEFAULT_ICON = fa_all.faMapMarkerAlt;

export const IconDeviceByName = ({ iconName, ...props }) => {
    return <FontAwesomeIcon
        icon={iconName ? fa_all['fa' + iconName] : MARKER_DEFAULT_ICON}
        {...props}
    />;
}

function toTitleCase(str) {
    return str.toLowerCase().replace(/(?:^|[\s-/])\w/g, function (match) {
        return match.toUpperCase();
    });
}

export const IconPicker = ({ data, setData }) => {
    const [anchorEl, setAnchorEl] = useState(null);
    const [filterText, setFilterText] = useState('');

    const names = Object.keys(fa_all).filter(x => x.startsWith('fa') && x.length > 3).map(x => x.substring(2));
    const shownNames = filterText.length === 0 ? names : names.filter(x => x.toLowerCase().includes(filterText));

    // const shownNames = filtered.slice(page, page + PAGE_LEN);

    return (
        <Box sx={{ position: 'relative' }}>
            <Tooltip title="Pick Icon" placement="top">
                <Paper
                    sx={{ border: 1, width: 30, height: 30, alignContent: 'center', textAlign: 'center' }}
                    onClick={(e) => {
                        e.stopPropagation();
                        setAnchorEl(anchorEl ? null : e.currentTarget);
                    }}
                // color={Boolean(anchorEl) ? "primary" : ""}
                >
                    <IconDeviceByName
                        iconName={data}
                    />
                </Paper>
            </Tooltip>
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
                        border: 1,
                        padding: 0.5,
                        overflowY: 'hidden'
                    }}
                    onClick={e => e.stopPropagation()}
                >
                    <Stack direction='row' alignItems='center' justifyContent='center'>
                        <TextFieldDebounceOutlined
                            value={filterText}
                            onChange={val => setFilterText(val)}
                            debounceMs={100}
                            tooltipTitle='Filter icons'
                        />
                    </Stack>
                    <Box sx={{
                        height: 30 * 12,
                        overflowY: 'auto'
                    }}>
                        {
                            Object.entries(iconsCategories).map(([cat, { icons, label }]) => {
                                const titleIcons = icons.map(x => toTitleCase(x));
                                const availableIcons = titleIcons.filter(x => fa_all['fa' + x]);
                                return (
                                    <Fragment key={cat}>
                                        <Typography>
                                            {label}
                                        </Typography>
                                        <ImageList
                                            sx={{
                                                // height: 30 * 12,
                                                margin: 0
                                            }}
                                            cols={12}
                                        >
                                            {availableIcons.map(name => (
                                                <ImageListItem key={name}>
                                                    <Tooltip
                                                        title={name}
                                                    >
                                                        <Paper
                                                            sx={{ border: 1, width: 30, height: 30, alignContent: 'center', textAlign: 'center' }}
                                                            onClick={() => setData(name)}
                                                        >
                                                            <FontAwesomeIcon
                                                                key={name}
                                                                icon={fa_all['fa' + name]}
                                                            />
                                                        </Paper>
                                                    </Tooltip>
                                                </ImageListItem>
                                            ))}
                                        </ImageList>
                                    </Fragment>
                                )
                            })
                        }
                    </Box>
                </Paper>
            </Popover>
        </Box>
    )
}
