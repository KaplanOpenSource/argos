import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import MapIcon from '@mui/icons-material/Map';
import PublicIcon from '@mui/icons-material/Public';
import {
    AppBar, IconButton, Stack, Toolbar, Tooltip, Typography
} from '@mui/material';
import { experimentContext } from '../Context/ExperimentProvider';
import { useContext } from 'react';
import { Add, CellTower, CloseFullscreen, OpenInFull, Redo, Undo } from '@mui/icons-material';
import EditLocationAltIcon from '@mui/icons-material/EditLocationAlt';
import EditLocationOutlinedIcon from '@mui/icons-material/EditLocationOutlined';
import { VersionId } from './VersionId';
import { ButtonTooltip } from '../Utils/ButtonTooltip';
import { UploadExperimentIcon } from '../Experiment/UploadExperimentIcon';

export const AppHeader = ({ fullscreen, setFullscreen, showDevicesOnly, setShowDevicesOnly }) => {
    const {
        undoOperation,
        redoOperation,
        undoPossible,
        redoPossible,
        currTrial,
        setCurrTrial,
        showImagePlacement,
        setShowImagePlacement,
        addExperiment,

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
                    spacing={1}
                    sx={{ flexGrow: 1 }}
                >
                    <Typography variant="h6" component="div">
                        Argos
                    </Typography>
                    <VersionId
                    />
                    <Stack
                        direction={'row'}
                        spacing={0}
                    >
                        <ButtonTooltip
                            color="inherit"
                            onClick={() => addExperiment()}
                            tooltip={"Add experiment"}
                        >
                            <Add />
                        </ButtonTooltip>
                        <UploadExperimentIcon
                        />
                        <ButtonTooltip
                            onClick={() => setFullscreen(!fullscreen)}
                            tooltip={fullscreen ? "Show experiment list on side" : "Expand experiment list on screen"}
                            color="inherit"
                        >
                            {fullscreen ? <CloseFullscreen /> : <OpenInFull />}
                        </ButtonTooltip>
                        <ButtonTooltip
                            onClick={() => {
                                setShowDevicesOnly(!showDevicesOnly);
                            }}
                            tooltip={!currTrial.experiment
                                ? "Choose an experiment to show only its devices"
                                : showDevicesOnly
                                    ? "Now showing only devices, click to show all experiments and trials"
                                    : "Now showing all experiments, click to show only devices of current experiment"}
                            color={showDevicesOnly ? "warning" : "inherit"}
                            disabled={!currTrial.experiment}
                        >
                            <CellTower />
                        </ButtonTooltip>
                    </Stack>
                </Stack>
                <ButtonTooltip
                    color="inherit"
                    // sx={{ mr: 2 }}
                    onClick={() => undoOperation()}
                    tooltip={"Undo"}
                    disabled={!undoPossible}
                >
                    <Undo />
                </ButtonTooltip>
                <ButtonTooltip
                    color="inherit"
                    // sx={{ mr: 2 }}
                    onClick={() => redoOperation()}
                    tooltip={"Redo"}
                    disabled={!redoPossible}
                >
                    <Redo />
                </ButtonTooltip>
                {experimentName
                    ? <>
                        <ButtonTooltip
                            color="inherit"
                            onClick={() => {
                                setCurrTrial({});
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
                                {trialName
                                    ? <>
                                        &nbsp;:&nbsp;
                                        {trialTypeName}
                                        &nbsp;:&nbsp;
                                        {trialName}
                                    </>
                                    : null}
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