import { Button, Dialog, DialogTitle, Menu, MenuItem, Stack, TextField } from "@mui/material";
import { ButtonTooltip } from "../Utils/ButtonTooltip"
import MenuIcon from '@mui/icons-material/Menu';
import { useContext, useState } from "react";
import { TokenContext } from "./TokenContext";
import { TextFieldDebounceOutlined } from "../Utils/TextFieldDebounce";

export const UserDetailsButton = ({ }) => {
    const { token } = useContext(TokenContext);
    const [open, setOpen] = useState(false);
    // const [menuAnchorElement, setMenuAnchorElement] = useState(null);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    // const handleClose = () => {
    //     setMenuAnchorElement(null);
    // };

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
                onClick={(e) => setOpen(true)} //setMenuAnchorElement(e.currentTarget)}
            >
                <MenuIcon />
            </ButtonTooltip>
            <Dialog onClose={() => setOpen(false)} open={open}>
                <DialogTitle>User Login</DialogTitle>
                <Stack direction='row' spacing={1} sx={{ margin: 1 }}>
                    <TextField
                        label='User Name'
                        onClick={
                            e => e.stopPropagation()
                        }
                        size="small"
                        InputLabelProps={{ shrink: true }}
                        sx={{ marginTop: 1 }}
                    />
                    <TextField
                        type="password"
                        label='Password'
                        onClick={
                            e => e.stopPropagation()
                        }
                        size="small"
                        InputLabelProps={{ shrink: true }}
                        sx={{ marginTop: 1 }}
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