import { Box, Collapse, IconButton, List, ListItem, ListItemButton, ListItemIcon, ListItemText, TextField, Typography } from "@mui/material"
import AddIcon from '@mui/icons-material/Add';

import dayjs from 'dayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { TreeItem } from "@mui/x-tree-view/TreeItem";
import { TrailSet } from "./TrailSet";

export const ExperimentRow = ({ name, data, setData }) => {
    const newTrialSetName = () => {
        const newName = 'new_trial_set';
        if (!(data.trailSet || []).find(t => t.name === newName)) {
            return newName
        }
        for (let i = 1; ; ++i) {
            if (!(data.trailSet || []).find(t => t.name === newName + '_' + i)) {
                return newName + '_' + i;
            }    
        }
    }

    const setTrialSetData = (trialName, trialNewData) => {
        const trailSet = (data.trailSet || []).slice();
        let i = trailSet.findIndex(t => t.name === trialName);
        i = i >= 0 ? i : trailSet.length;
        trailSet[i] = { name: trialName, data: trialNewData };
        setData({ ...data, trailSet });
    }

    return (
        <TreeItem
            key={name}
            nodeId={name}
            label={
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        // p: 0.5,
                        // pr: 0,
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
                        onClick={() => setTrialSetData(newTrialSetName(), {})}
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
                (data.trailSet || []).map((e, i) => (
                    <TrailSet
                        key={e.name}
                        name={e.name}
                        data={e.data}
                        setData={newData => setTrialSetData(e.name, newData)}
                    />
                ))
            }
        </TreeItem>
    )
}