import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import MapIcon from '@mui/icons-material/Map';
import PublicIcon from '@mui/icons-material/Public';
import {
    AppBar, Box, IconButton, Stack, Toolbar, Tooltip, Typography
} from '@mui/material';
import { experimentContext } from '../Context/ExperimentProvider';
import { useContext } from 'react';
import { Redo, Undo } from '@mui/icons-material';
import EditLocationAltIcon from '@mui/icons-material/EditLocationAlt';
import EditLocationOutlinedIcon from '@mui/icons-material/EditLocationOutlined';
import { VersionId } from './VersionId';
import { ButtonTooltip } from '../Utils/ButtonTooltip';

export const AppHeader = ({ }) => {
    const {
        undoOperation,
        redoOperation,
        currTrial,
        setCurrTrial,
        showImagePlacement,
        setShowImagePlacement,
    } = useContext(experimentContext);
    const { experimentName, trialTypeName, trialName, shownMapName } = currTrial;
    return (
        <AppBar position="static"
        // style={{ maxHeight: '5em' }}
        >
            <Toolbar>
                <IconButton
                    // size="large"
                    edge="start"
                    color="inherit"
                    aria-label="menu"
                    sx={{ mr: 2 }}
                >
                    <MenuIcon />
                </IconButton>
                <Stack
                    direction={'row'}
                    spacing={2}
                    sx={{ flexGrow: 1 }}
                >
                    <Typography variant="h6" component="div">
                        Argos
                    </Typography>
                    <VersionId
                    />
                </Stack>
                <ButtonTooltip
                    color="inherit"
                    // sx={{ mr: 2 }}
                    onClick={() => undoOperation()}
                    tooltip={"Undo"}
                >
                    <Undo />
                </ButtonTooltip>
                <ButtonTooltip
                    color="inherit"
                    // sx={{ mr: 2 }}
                    onClick={() => redoOperation()}
                    tooltip={"Redo"}
                >
                    <Redo />
                </ButtonTooltip>
                {
                    trialName
                        ? <>
                            <ButtonTooltip
                                color="inherit"
                                onClick={() => {
                                    setCurrTrial();
                                }}
                                tooltip={"Stop editing this trial"}
                            >
                                <CloseIcon />
                            </ButtonTooltip>
                            <Tooltip
                                title="Experiment and trial currently edited"
                            >
                                <Typography variant="body1" paddingRight={1}>
                                    {experimentName}
                                    &nbsp;:&nbsp;
                                    {trialTypeName}
                                    &nbsp;:&nbsp;
                                    {trialName}
                                </Typography>
                            </Tooltip>
                            {shownMapName
                                ? <Tooltip title={"Shown map"}>
                                    <Stack direction={"row"}>
                                        <MapIcon />
                                        <Typography variant="body1" paddingRight={1}>
                                            {shownMapName}
                                        </Typography>
                                    </Stack>
                                </Tooltip>
                                : <Tooltip title={"Real map with embedding"}>
                                    <PublicIcon />
                                </Tooltip>
                            }
                            <ButtonTooltip
                                color='inherit'
                                onClick={() => setShowImagePlacement(!showImagePlacement)}
                                tooltip="Edit image placement"
                            >
                                {showImagePlacement
                                    ? <EditLocationAltIcon />
                                    : <EditLocationOutlinedIcon />
                                }
                            </ButtonTooltip>
                        </>
                        : null
                }
                {/* <Button color="inherit">Login</Button> */}
            </Toolbar>
        </AppBar>
    )
}