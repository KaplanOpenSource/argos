import { Box, Collapse, IconButton, List, ListItem, ListItemButton, ListItemIcon, ListItemText, TextField, Typography } from "@mui/material"
import AddIcon from '@mui/icons-material/Add';

import dayjs from 'dayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { ListItemCollapsable } from "./ListItemCollapsable";
import { TreeItem } from "@mui/x-tree-view/TreeItem";

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
                    {/* <Box component={LabelIcon} color="inherit" sx={{ mr: 1 }} /> */}
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

                    {/* <Typography variant="caption" color="inherit">
                                    {labelInfo}
                                </Typography> */}
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
        </TreeItem>
        // <ListItemCollapsable
        //     name={name}
        //     components={
        //         <>
        //             <DatePicker
        //                 label="Start Date"
        //                 format='DD/MM/YYYY'
        //                 value={dayjs(data.startDate)}
        //                 onChange={(val) => setData({ ...data, startDate: val })}
        //             />
        //             <DatePicker
        //                 label="End Date"
        //                 format='DD/MM/YYYY'
        //                 value={dayjs(data.endDate)}
        //                 onChange={(val) => setData({ ...data, endDate: val })}
        //             />
        //             <IconButton
        //                 edge="start"
        //                 color="inherit"
        //                 onClick={() => addExperiment()}
        //             >
        //                 <AddIcon />
        //             </IconButton>

        //         </>
        //     }
        // >
        //     <List component="div" disablePadding>
        //         <ListItem>
        //         </ListItem>
        //         {
        //             (data.trailSet || []).map(e => (
        //                 <TrailSet
        //                     key={e.name}
        //                     name={e.name}
        //                     data={e.data}
        //                 />
        //             ))
        //         }
        //     </List>
        // </ListItemCollapsable>
    )
}