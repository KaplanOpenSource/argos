import * as fa_all from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Box, IconButton, ImageList, ImageListItem, Paper, Popover, Stack, TextField, Tooltip } from "@mui/material";
import { useState } from "react";
import { ButtonTooltip } from "../Utils/ButtonTooltip";
import { SkipNext, SkipPrevious } from "@mui/icons-material";
import { TextFieldDebounceOutlined } from "../Utils/TextFieldDebounce";

const PAGE_ROWS = 12;
const PAGE_COLS = 12;
const PAGE_LEN = PAGE_COLS * PAGE_ROWS;
export const IconPicker = ({ data, setData }) => {
    const [anchorEl, setAnchorEl] = useState(null);
    const [page, setPage] = useState(0);
    const [filterText, setFilterText] = useState('');

    const names = Object.keys(fa_all).filter(x => x.startsWith('fa') && x.length > 3).map(x => x.substring(2));
    const filtered = filterText.length === 0 ? names : names.filter(x => x.toLowerCase().includes(filterText));

    const shownNames = filtered.slice(page, page + PAGE_LEN);

    return (
        <Box sx={{ position: 'relative' }}>
            <Tooltip title="Edit attribute types" placement="top">
                <Paper
                    sx={{ border: 1, width: 30, height: 30, alignContent: 'center', textAlign: 'center' }}
                    onClick={(e) => {
                        e.stopPropagation();
                        setAnchorEl(anchorEl ? null : e.currentTarget);
                    }}
                // color={Boolean(anchorEl) ? "primary" : ""}
                >
                    <FontAwesomeIcon
                        icon={data ? fa_all['fa' + data] : fa_all.faMapMarkerAlt}
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
                    sx={{ border: 1, padding: 0.5 }}
                    onClick={e => e.stopPropagation()}
                >
                    <Stack direction='row' alignItems='center' justifyContent='center'>
                        <TextFieldDebounceOutlined
                            value={filterText}
                            onChange={val => setFilterText(val)}
                            debounceMs={100}
                            tooltipTitle='Filter icons'
                        />
                        <ButtonTooltip
                            tooltip='Prev icons'
                            onClick={() => setPage(page - PAGE_LEN)}
                            disabled={page <= 0}
                        >
                            <SkipPrevious />
                        </ButtonTooltip>
                        <ButtonTooltip
                            tooltip='Next icons'
                            onClick={() => setPage(page + PAGE_LEN)}
                            disabled={page + PAGE_LEN >= names.length}
                        >
                            <SkipNext />
                        </ButtonTooltip>
                    </Stack>
                    <ImageList
                        sx={{
                            // width: 500,
                            // height: 30 * 16,
                            margin: 0
                        }}
                        cols={PAGE_COLS}
                    >
                        {shownNames.map(name => (
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
                </Paper>
            </Popover>
        </Box>
    )
}
