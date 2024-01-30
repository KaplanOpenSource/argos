import { useState } from "react";
import { Collapse, IconButton, List, ListItem, ListItemButton, ListItemIcon, ListItemText, TextField } from "@mui/material"
// import SendIcon from '@mui/icons-material/Send';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';

export const ListItemCollapsable = ({ name, components, children }) => {
    const [open, setOpen] = useState(false);

    return (
        <>
            <ListItem
            >
                <ListItemText primary={name} />
                {components}
                <IconButton
                    onClick={() => setOpen(!open)}
                >
                    {open ? <ExpandLess /> : <ExpandMore />}
                </IconButton>
            </ListItem>
            <Collapse in={open} timeout="auto" unmountOnExit>
                {children}
            </Collapse>
        </>
    )
}