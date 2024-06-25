import { Button, Dialog, DialogTitle, Slide, Stack, TextField } from "@mui/material";
import { ButtonTooltip } from "../Utils/ButtonTooltip"
import MenuIcon from '@mui/icons-material/Menu';
import { forwardRef, useContext, useEffect, useState } from "react";
import { TokenContext } from "./TokenContext";
import { baseUrl } from "../Context/FetchExperiment";
import axios from 'axios';

const Transition = forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

export const UserDetailsButton = ({ }) => {
    const [open, setOpen] = useState(false);

    return (
        <>
            <ButtonTooltip
                color="inherit"
                tooltip={'User details'}
                onClick={(e) => setOpen(true)}
            >
                <MenuIcon />
            </ButtonTooltip>
            <Dialog
                onClose={() => setOpen(false)}
                open={open}
                TransitionComponent={Transition}
            >
                <DialogTitle>User Login</DialogTitle>
                <UserDetailsDialog />
            </Dialog>
        </>
    )
}

const UserDetailsDialog = ({ }) => {
    const { hasToken, doLogin, doLogout } = useContext(TokenContext);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [inputElement, setInputElement] = useState();

    useEffect(() => {
        inputElement && inputElement.focus()
    }, [inputElement])

    return (
        <>
            <Stack direction='row' spacing={1} sx={{ margin: 1 }}>
                <TextField
                    label='User Name'
                    size="small"
                    InputLabelProps={{ shrink: true }}
                    sx={{ marginTop: 1 }}
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                    inputRef={input => {
                        setInputElement(input)
                    }}
                />
                <TextField
                    type="password"
                    label='Password'
                    size="small"
                    InputLabelProps={{ shrink: true }}
                    sx={{ marginTop: 1 }}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                />
            </Stack>
            <Stack direction='row' spacing={1} sx={{ margin: 1 }} justifyContent={'center'}>
                <Button variant="contained"
                    disabled={username === '' || password === ''}
                    onClick={async () => {
                        await doLogin(username, password);
                        if (hasToken) {
                            setUsername("");
                            setPassword("");
                            setOpen(false);
                        }
                    }}
                >
                    Login
                </Button>
            </Stack>
            <Stack direction='row' spacing={1} sx={{ margin: 1 }} justifyContent={'center'}>
                <Button variant="contained"
                    disabled={!hasToken}
                    onClick={async () => {
                        await doLogout();
                        if (!hasToken) {
                            setUsername("");
                            setPassword("");
                            setOpen(false);
                        }
                    }}
                >
                    Logout
                </Button>
                <Button variant="contained"
                    onClick={() => setOpen(false)}
                >
                    Cancel
                </Button>
            </Stack>
        </>
    )
}