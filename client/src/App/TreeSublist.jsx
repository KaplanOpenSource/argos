import { Box, IconButton, Tooltip, Typography } from "@mui/material";
import AddIcon from '@mui/icons-material/Add';

import { camelCaseToWords, createNewName } from "../Utils/utils";
import { TreeItem } from "@mui/x-tree-view/TreeItem";

export const TreeSublist = ({ nameTemplate, fieldName, data, setData, newDataCreator, parentKey, components, children }) => {
    const items = data[fieldName] || [];
    const key = parentKey + '_' + fieldName;

    return (
        <TreeItem
            key={key}
            nodeId={key}
            label={
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        alignContent: 'flex-start',
                        // p: 0.5,
                        // pr: 0,
                    }}
                >
                    <Typography variant="body2" sx={{
                        fontWeight: 'inherit',
                        //  flexGrow: 1
                    }}>
                        {camelCaseToWords(fieldName)}
                    </Typography>
                    <Tooltip title="Add New" placement="right">
                        <IconButton
                            sx={{
                                display: 'flex',
                                alignSelf: 'flex-start',
                                alignContent: 'flex-start',
                                alignItems: 'flex-start',
                            }}
                            // color="inherit"
                            onClick={() => {
                                const theData = newDataCreator ? newDataCreator() : {};
                                theData.name = createNewName(items, nameTemplate);
                                setData({ ...data, [fieldName]: [...items, theData] });
                            }}
                        >
                            <AddIcon />
                        </IconButton>
                    </Tooltip>
                    {components}
                </Box>
            }
        >
            {children}
        </TreeItem>
    )
}
