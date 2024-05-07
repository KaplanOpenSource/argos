import { Box, TextField } from "@mui/material";

import { TreeItem } from "@mui/x-tree-view/TreeItem";
import { TextFieldDebounce } from "../Utils/TextFieldDebounce";

export const TreeRow = ({ data, setData, components, nodeId, withDescription = true, children }) => {
    const { name } = data;
    return (
        <TreeItem
            key={name}
            nodeId={nodeId === undefined ? name : nodeId}
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
                    <TextFieldDebounce
                        sx={{ padding: '5px' }}
                        variant="outlined"
                        size="small"
                        label="Name"
                        InputLabelProps={{ shrink: true }}
                        value={name}
                        onChange={val => setData({ ...data, name: val })}
                        disabled={!setData}
                    />
                    {components}
                </Box>
            }
        // sx={{ padding: '5px' }}
        >
            {children}
        </TreeItem>
    )
}