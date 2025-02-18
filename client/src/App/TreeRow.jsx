import { Box } from "@mui/material";
import { TreeItem } from "@mui/x-tree-view/TreeItem";
import { TextFieldDebounce } from "../Utils/TextFieldDebounce";
import { useEffect } from "react";
import { assignUuids } from "../Context/TrackUuidUtils";

export const TreeRow = ({ data, setData, components, children, textProps }) => {
    const { name } = data;

    useEffect(() => {
        if (!data.trackUuid) {
            console.log("if you get here, then this item was created without a uuid", data);
            setData(assignUuids({ ...data }))
        }
    }, [(data || {}).trackUuid]);

    if (!(data || {}).trackUuid) {
        return null;
    }

    return (
        <TreeItem
            key={data.trackUuid}
            nodeId={data.trackUuid}
            label={
                <div style={{ pointerEvents: 'none' }}>
                    <div style={{ pointerEvents: 'all', display: 'inline-block' }}>
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
                                {...textProps}
                            />
                            {components}
                        </Box>
                    </div>
                </div>
            }
        // sx={{ padding: '5px' }}
        >
            {children}
        </TreeItem>
    )
}