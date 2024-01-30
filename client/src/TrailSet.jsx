import { Box, Collapse, IconButton, List, ListItem, ListItemButton, ListItemIcon, ListItemText, TextField, Typography } from "@mui/material"
import AddIcon from '@mui/icons-material/Add';
import { TreeItem } from "@mui/x-tree-view/TreeItem";

export const TrailSet = ({ name, data, setData }) => {
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
                    <TextField
                        variant="outlined"
                        label="Description"
                        InputLabelProps={{ shrink: true }}
                        value={data.description}
                        onChange={e => setData({ ...data, description: e.target.value })}
                    />
                </Box>
            }
        >
            {/* {
                (data.trailSet || []).map(e => (
                    <TrailSet
                        key={e.name}
                        name={e.name}
                        data={e.data}
                    />
                ))
            } */}
        </TreeItem>
    )
}
