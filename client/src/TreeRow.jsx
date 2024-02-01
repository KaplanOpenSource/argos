import { Box, TextField, Typography } from "@mui/material";

import { TreeItem } from "@mui/x-tree-view/TreeItem";

export const TreeRow = ({ name, data, setData, nameData, setNameData, components, children }) => {

    // Temp until all name/data/setData are replaced by nameData/setNameData
    if (nameData) {
        ({ name, data } = nameData);
    }
    if (setNameData) {
        setData = data => {
            setNameData({ name, data });
        }
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
                        onChange={e => setNameData({ name: e.target.value, data })}
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