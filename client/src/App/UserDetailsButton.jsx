import { Button, Dialog, DialogTitle, Slide, Stack, TextField } from "@mui/material";
import { ButtonTooltip } from "../Utils/ButtonTooltip"
import MenuIcon from '@mui/icons-material/Menu';
import { forwardRef, useContext, useEffect, useState } from "react";
import { TokenContext } from "./TokenContext";

const Transition = forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

export const UserDetailsButton = ({ }) => {
    const [open, setOpen] = useState(false);
    const { hasToken } = useContext(TokenContext);

    useEffect(() => {
        if (!hasToken && !open) {
            setOpen(true);
        }
    }, [hasToken, open]);

    return (
        <>
            <ButtonTooltip
                color="inherit"
                tooltip={'User details'}
                onClick={(e) => setOpen(true)}
            >
                <MenuIcon />
            </ButtonTooltip>
            <UserDetailsDialog
                open={open}
                setOpen={setOpen}
            />
        </>
    )
}

const UserDetailsDialog = ({ open, setOpen }) => {
    const { hasToken, doLogin, doLogout, baseUrl, setBaseUrl } = useContext(TokenContext);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [inputElement, setInputElement] = useState();
    const [showBackend, setShowBackend] = useState(false);

    useEffect(() => {
        inputElement && inputElement.focus()
    }, [inputElement])

    const onKeyDown = e => {
        if (e.altKey && e.ctrlKey && e.key === 'a') {
            setShowBackend(!showBackend);
        }
    }

    return (
        <Dialog
            onClose={() => setOpen(false)}
            open={open}
            // TransitionComponent={Transition}
            onKeyDown={onKeyDown}
        >
            <DialogTitle>User Login</DialogTitle>
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
                    disabled={hasToken}
                    onKeyDown={onKeyDown}
                />
                <TextField
                    type="password"
                    label='Password'
                    size="small"
                    InputLabelProps={{ shrink: true }}
                    sx={{ marginTop: 1 }}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    disabled={hasToken}
                />
            </Stack>
            <Stack direction='row' spacing={1} sx={{ margin: 1 }} justifyContent={'center'}>
                <Button variant="contained"
                    disabled={username === '' || password === '' || hasToken}
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
            {!showBackend ? null :
                <TextField
                    label='Backend URL'
                    size="small"
                    value={baseUrl}
                    onChange={e => setBaseUrl(e.target.value)}
                />
            }
        </Dialog>
    )
}