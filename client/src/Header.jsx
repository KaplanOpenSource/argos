import MenuIcon from '@mui/icons-material/Menu';
import AddIcon from '@mui/icons-material/Add';
import {
    AppBar, IconButton, Toolbar, Typography, Button, List, ListItemButton, ListItemIcon, ListItemText
} from '@mui/material';

export const Header = ({ setExperiments }) => {
    return (
        <AppBar position="static">
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
                    onClick={() => {
                        (async () => {
                            const data = { a: 1, b: 'Textual content' };
                            const name = prompt('Experiment name');
                            const resp = await fetch("http://127.0.0.1:8080/experiment_set/" + name, {
                                method: 'POST',
                                headers: {
                                    'Accept': 'application/json',
                                    'Content-Type': 'application/json'
                                },
                                body: JSON.stringify(data)
                            });
                            const json = await resp.json();
                            if ((json || {}).error) {
                                alert(json.error);
                                return;
                            }
                            setExperiments(prev => [...prev, { name, data }]);
                        })()
                    }}
                >
                    <AddIcon />
                </IconButton>
            </Toolbar>
        </AppBar>
    )
}