import { useState } from "react";
import { Collapse, IconButton, List, ListItem, ListItemButton, ListItemIcon, ListItemText, TextField } from "@mui/material"
// import SendIcon from '@mui/icons-material/Send';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';

import dayjs from 'dayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
export const ExperimentRow = ({ name, data, setData }) => {
    const [open, setOpen] = useState(false);

    return (
        <>
            <ListItem
            >
                {/* <ListItemIcon>
                    <SendIcon />
                </ListItemIcon> */}
                <ListItemText primary={name} />
                <DatePicker
                    label="Start Date"
                    format='DD/MM/YYYY'
                    value={dayjs(data.startDate)}
                    onChange={(val) => setData({ ...data, startDate: val })}
                />
                <DatePicker
                    label="End Date"
                    format='DD/MM/YYYY'
                    value={dayjs(data.endDate)}
                    onChange={(val) => setData({ ...data, endDate: val })}
                />
                <IconButton
                    onClick={() => setOpen(!open)}
                >
                    {open ? <ExpandLess /> : <ExpandMore />}
                </IconButton>
            </ListItem>
            <Collapse in={open} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                    <ListItem>
                        <TextField
                            variant="outlined"
                            label="Description"
                            InputLabelProps={{ shrink: true }}
                            value={data.description}
                            onChange={e => setData({ ...data, description: e.target.value })}
                        />
                    </ListItem>
                    <ListItemButton sx={{ pl: 4 }}>
                        {/* <ListItemIcon>
                            <StarBorder />
                        </ListItemIcon> */}
                        {/* <ListItemText primary="Starred" /> */}
                    </ListItemButton>
                </List>
            </Collapse>
        </>
        // <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
        //   {e.name}
        // </Typography>
    )
}