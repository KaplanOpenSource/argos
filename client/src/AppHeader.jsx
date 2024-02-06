import MenuIcon from '@mui/icons-material/Menu';
import AddIcon from '@mui/icons-material/Add';
import {
    AppBar, IconButton, Toolbar, Typography
} from '@mui/material';
import { experimentContext } from './ExperimentProvider';
import { useContext } from 'react';

export const AppHeader = ({ }) => {
    const { addExperiment } = useContext(experimentContext);
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
                {/* <Button color="inherit">Login</Button> */}
                <IconButton
                    edge="start"
                    color="inherit"
                    onClick={() => addExperiment()}
                >
                    <AddIcon />
                </IconButton>
            </Toolbar>
        </AppBar>
    )
}