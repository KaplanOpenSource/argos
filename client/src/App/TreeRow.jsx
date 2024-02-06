import { Box, TextField } from "@mui/material";

import { TreeItem } from "@mui/x-tree-view/TreeItem";

export const TreeRow = ({ data, setData, components, children }) => {
    const { name } = data;
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
                    {/* <Typography variant="body2"
                        sx={{ fontWeight: 'inherit', flexGrow: 1 }}
                    >
                        {name}
                    </Typography> */}
                    <TextField
                        sx={{ padding: '5px' }}
                        variant="outlined"
                        size="small"
                        label="Name"
                        InputLabelProps={{ shrink: true }}
                        value={name}
                        onChange={e => setData({ ...data, name: e.target.value })}
                    />
                    {components}
                </Box>
            }
            sx={{ padding: '5px' }}
        >
            <TextField
                sx={{ padding: '5px' }}
                variant="outlined"
                size="small"
                label="Description"
                InputLabelProps={{ shrink: true }}
                value={data.description}
                onChange={e => setData({ ...data, description: e.target.value })}
            />
            {children}
        </TreeItem>
    )
}