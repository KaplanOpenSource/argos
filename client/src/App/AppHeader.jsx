import MenuIcon from '@mui/icons-material/Menu';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import MapIcon from '@mui/icons-material/Map';
import PublicIcon from '@mui/icons-material/Public';
import {
    AppBar, Button, IconButton, Toolbar, Typography
} from '@mui/material';
import { experimentContext } from '../Context/ExperimentProvider';
import { useContext } from 'react';
import { Redo, Undo } from '@mui/icons-material';

export const AppHeader = ({ }) => {
    const { undoOperation, redoOperation, currTrial, setCurrTrial, setShowExperiments } = useContext(experimentContext);
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
                <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                    Argos
                </Typography>
                <IconButton
                    // size="large"
                    edge="start"
                    color="inherit"
                    aria-label="menu"
                    sx={{ mr: 2 }}
                    onClick={() => undoOperation()}
                >
                    <Undo />
                </IconButton>
                <IconButton
                    // size="large"
                    edge="start"
                    color="inherit"
                    aria-label="menu"
                    sx={{ mr: 2 }}
                    onClick={() => redoOperation()}
                >
                    <Redo />
                </IconButton>
                {
                    trialName
                        ? <>
                            {/* <Button
                                color="inherit"
                                variant='outlined'
                                style={{ marginRight: 10 }}
                                onClick={() => setShowExperiments(!showExperiments)}
                            >
                                {showExperiments ? 'Hide' : 'Show'} Experiments
                            </Button> */}
                            <IconButton
                                edge="start"
                                color="inherit"
                                onClick={() => {
                                    setCurrTrial();
                                    setShowExperiments(true);
                                }}
                            >
                                <CloseIcon />
                            </IconButton>
                            <Typography variant="body1" paddingRight={1}>
                                {experimentName}
                                &nbsp;:&nbsp;
                                {trialTypeName}
                                &nbsp;:&nbsp;
                                {trialName}
                            </Typography>
                            {shownMapName
                                ? <>
                                    <MapIcon />
                                    <Typography variant="body1" paddingRight={1}>
                                        {shownMapName}
                                    </Typography>
                                </>
                                : <>
                                    <PublicIcon />
                                </>
                            }
                        </>
                        : null
                }
                {/* <Button color="inherit">Login</Button> */}
                {/* <IconButton
                    edge="start"
                    color="inherit"
                    onClick={() => addExperiment()}
                >
                    <AddIcon />
                </IconButton> */}
            </Toolbar>
        </AppBar>
    )
}