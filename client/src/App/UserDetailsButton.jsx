import { Button, Dialog, DialogTitle, Slide, Stack, TextField } from "@mui/material";
import { ButtonTooltip } from "../Utils/ButtonTooltip"
import MenuIcon from '@mui/icons-material/Menu';
import { forwardRef, useContext, useState } from "react";
import { TokenContext } from "./TokenContext";
import { baseUrl } from "../Context/FetchExperiment";
import axios from 'axios';

const Transition = forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

export const UserDetailsButton = ({ }) => {
    const { token, setToken, removeToken, hasToken } = useContext(TokenContext);
    const [open, setOpen] = useState(false);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const doLogin = async () => {
        try {
            const data = await axios.post(baseUrl + "/login",
                { username, password },
                {
                    headers: { "Content-Type": "application/json" },
                    // transformResponse: x => { console.log(x); return JSON.parse(x); }
                });
            // console.log(data)
            setToken(data.data.access_token);
            setUsername("");
            setPassword("");
            setOpen(false);
        } catch (e) {
            console.log(e);
            alert(e?.response?.data?.msg || e)
        }
    }

    const doLogout = async () => {
        try {
            const data = await axios.post(baseUrl + "/logout");
            removeToken();
            setUsername("");
            setPassword("");
            setOpen(false);
        } catch (e) {
            console.log(e);
            alert(e?.response?.data?.msg || e)
        }
    }

    // console.log(token);

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
                    <Button variant="contained"
                        disabled={username === '' || password === ''}
                        onClick={() => doLogin()}
                    >
                        Login
                    </Button>
                </Stack>
                <Stack direction='row' spacing={1} sx={{ margin: 1 }} justifyContent={'center'}>
                    <Button variant="contained"
                        disabled={!hasToken}
                        onClick={() => doLogout()}
                    >
                        Logout
                    </Button>
                    <Button variant="contained"
                        onClick={() => setOpen(false)}
                    >
                        Cancel
                    </Button>
                </Stack>
            </Dialog>
        </>
    )
}