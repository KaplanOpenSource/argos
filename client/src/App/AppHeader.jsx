import MenuIcon from '@mui/icons-material/Menu';
import {
    AppBar, IconButton, Stack, Toolbar, Typography
} from '@mui/material';
import { VersionId } from './VersionId';

export const AppHeader = ({ children }) => {
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
                        {children}
                    </Stack>
                </Stack>
                {/* <Button color="inherit">Login</Button> */}
            </Toolbar>
        </AppBar>
    )
}