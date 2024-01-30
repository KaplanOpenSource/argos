import { Collapse, IconButton, List, ListItem, ListItemButton, ListItemIcon, ListItemText, TextField } from "@mui/material"
import AddIcon from '@mui/icons-material/Add';

import dayjs from 'dayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { ListItemCollapsable } from "./ListItemCollapsable";

export const ExperimentRow = ({ name, data, setData }) => {
    return (
        <ListItemCollapsable
            name={name}
            components={
                <>
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
                        edge="start"
                        color="inherit"
                        onClick={() => addExperiment()}
                    >
                        <AddIcon />
                    </IconButton>

                </>
            }
        >
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
                {
                    (data.trailSet || []).map(e => (
                        <TrailSet
                            key={e.name}
                            name={e.name}
                            data={e.data}
                        />
                    ))
                }
            </List>
        </ListItemCollapsable>
    )
}