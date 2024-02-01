import { Box, TextField, Typography } from "@mui/material";

import { TreeItem } from "@mui/x-tree-view/TreeItem";

export const TreeRow = ({ name, data, setData, components, children }) => {
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
                    {components}
                </Box>
            }
        >
            <TreeItem
                key={name + '_desc'}
                nodeId={name + '_desc'}
                label={
                    <TextField
                        variant="outlined"
                        size="small"
                        label="Description"
                        InputLabelProps={{ shrink: true }}
                        value={data.description}
                        onChange={e => setData({ ...data, description: e.target.value })}
                    />
                }
            >
            </TreeItem>
            {children}
        </TreeItem>
    )
}