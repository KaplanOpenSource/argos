import { Button, Dialog, DialogTitle, Slide, Stack, TextField } from "@mui/material";
import { ButtonTooltip } from "../Utils/ButtonTooltip"
import MenuIcon from '@mui/icons-material/Menu';
import { forwardRef, useContext, useState } from "react";
import { TokenContext } from "./TokenContext";

const Transition = forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

export const UserDetailsButton = ({ }) => {
    const { token } = useContext(TokenContext);
    const [open, setOpen] = useState(false);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const doLogin = () => {
        setOpen(false);
    }

    const doLogout = () => {
        setOpen(false);
    }

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
                <Stack direction='row' spacing={1} sx={{ margin: 1 }}>
                    <TextField
                        label='User Name'
                        size="small"
                        InputLabelProps={{ shrink: true }}
                        sx={{ marginTop: 1 }}
                        value={username}
                        onChange={e => setUsername(e.target.value)}
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
                    <Button variant="contained" onClick={() => doLogin()}>Login</Button>
                </Stack>
                <Stack direction='row' spacing={1} sx={{ margin: 1 }} justifyContent={'center'}>
                    <Button variant="contained" disabled={!token} onClick={() => doLogout()}>Logout</Button>
                    <Button variant="contained" onClick={() => setOpen(false)}>Cancel</Button>
                </Stack>
            </Dialog>
        </>
    )
}