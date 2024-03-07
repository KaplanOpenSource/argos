import React from 'react';
import {
    Divider,
    IconButton,
    Typography,
    Grid,
    Box,
    Tooltip,
    Paper,
} from '@mui/material';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import CloseIcon from "@mui/icons-material/Close";
import {
    POINT_SHAPE
} from './utils/constants';
import { ButtonWithShadow } from './ToolsBar/ButtonWithShadow';

export const EditTool = ({ icon, id, component, title, shape, markedPoints, onClickIcon, showEditBox, onSubmit, submitText }) => {
    return (
        <>
            <Tooltip
                title={title}
                placement="top"
            >
                <IconButton key={id}
                    color={shape === id ? "primary" : ""}
                    onClick={() => onClickIcon(id)}
                >
                    {icon}
                </IconButton>
            </Tooltip>
            {showEditBox && shape === id && (
                <Paper
                    sx={{
                        position: 'absolute',
                        bottom: 'calc(100% + 10px)',
                        left: 0,
                        zIndex: 1000,
                        padding: '5px',
                        border: 2,
                        borderColor: 'black',
                    }}
                >
                    <Grid container 
                        style={{
                            minWidth: 300,
                            minHeight: `100%`
                        }}
                    >
                        <Grid item>
                            {React.cloneElement(component, {
                                markedPoints,
                                title
                            })}
                        </Grid>
                        <Grid item style={{
                            display: 'flex',
                            justifyContent: 'flex-start',
                            alignItems: 'center',
                            marginTop: '10px'
                        }}>
                            <IconButton
                                // size='small'
                                onClick={() => onClickIcon(id)}
                            >
                                <CloseIcon />
                            </IconButton>
                            <Typography component="span">
                                <Box sx={{ fontWeight: '700' }}>
                                    {title}
                                </Box>
                            </Typography>
                            {!onSubmit ? null :
                                <ButtonWithShadow className="button"
                                    text={submitText ? submitText : "distribute"}
                                    onClick={onSubmit}
                                    style={{ right: '0px', marginLeft: '5px' }}
                                />
                            }
                        </Grid>

                    </Grid>
                </Paper>
            )}
        </>
    );
}