import { Box, Collapse, IconButton, List, ListItem, ListItemButton, ListItemIcon, ListItemText, TextField, Typography } from "@mui/material"
import AddIcon from '@mui/icons-material/Add';

import dayjs from 'dayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { TreeItem } from "@mui/x-tree-view/TreeItem";
import { TrailSet } from "./TrailSet";

export const ExperimentRow = ({ name, data, setData }) => {
    return (
        <TreeItem
            key={name}
            nodeId={name}
            label={
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        p: 0.5,
                        pr: 0,
                    }}
                >
                    <Typography variant="body2" sx={{ fontWeight: 'inherit', flexGrow: 1 }}>
                        {name}
                    </Typography>
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
                        onClick={() => setData({ ...data, trailSet: [...(data.trailSet || []), { name: 'new trialSet', data: {} }] })}
                    >
                        <AddIcon />
                    </IconButton>
                </Box>
            }
        >
            <TreeItem
                key={name + '_desc'}
                nodeId={name + '_desc'}
                label={
                    <TextField
                        variant="outlined"
                        label="Description"
                        InputLabelProps={{ shrink: true }}
                        value={data.description}
                        onChange={e => setData({ ...data, description: e.target.value })}
                    />
                }
            >
            </TreeItem>
            {
                (data.trailSet || []).map(e => (
                    <TrailSet
                        key={e.name}
                        name={e.name}
                        data={e.data}
                    />
                ))
            }
        </TreeItem>
    )
}