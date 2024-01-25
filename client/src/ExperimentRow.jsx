import { useState } from "react";
import { Collapse, List, ListItemButton, ListItemIcon, ListItemText } from "@mui/material"
// import SendIcon from '@mui/icons-material/Send';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';

import dayjs from 'dayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
export const ExperimentRow = ({ name, data, setData }) => {
    const [open, setOpen] = useState(false);

    return (
        <>
            <ListItemButton
                onClick={() => setOpen(!open)}
            >
                {/* <ListItemIcon>
                    <SendIcon />
                </ListItemIcon> */}
                <ListItemText primary={name} />
                <DatePicker
                    label="Start Date"
                    value={dayjs(data.startDate)}
                    onChange={(val) => setData({ ...data, startDate: val })}
                />
                <DatePicker
                    label="End Date"
                    value={dayjs(data.endDate)}
                    onChange={(val) => setData({ ...data, endDate: val })}
                />
                {open ? <ExpandLess /> : <ExpandMore />}
            </ListItemButton>
            <Collapse in={open} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                    <ListItemButton sx={{ pl: 4 }}>
                        {/* <ListItemIcon>
                            <StarBorder />
                        </ListItemIcon> */}
                        <ListItemText primary="Starred" />
                    </ListItemButton>
                </List>
            </Collapse>
        </>
        // <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
        //   {e.name}
        // </Typography>
    )
}