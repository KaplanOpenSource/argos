import { Box, IconButton, Tooltip, Typography } from "@mui/material";
import AddIcon from '@mui/icons-material/Add';

import { camelCaseToWords } from "./utils";

export const TreeSublist = ({ nameTemplate, fieldName, data, setData, component }) => {
    const items = data[fieldName] || [];
    const setItems = val => {
        setData({ ...data, [fieldName]: val });
    }

    const newName = () => {
        if (!items.find(t => t.name === nameTemplate)) {
            return nameTemplate
        }
        for (let i = 1; ; ++i) {
            if (!items.find(t => t.name === nameTemplate + '_' + i)) {
                return nameTemplate + '_' + i;
            }
        }
    }

    const setItemData = (theName, theData) => {
        const theItems = (items || []).slice();
        let i = theItems.findIndex(t => t.name === theName);
        i = i >= 0 ? i : theItems.length;
        theItems[i] = { name: theName, data: theData };
        setItems(theItems);
    }

    const label = camelCaseToWords(fieldName);

    return (
        <>
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
                    {label}
                </Typography>
                <Tooltip title="Add New" placement="right">
                    <IconButton
                        sx={{
                            display: 'flex',
                            alignSelf: 'flex-start',
                            alignContent: 'flex-start',
                            alignItems: 'flex-start',
                        }}
                        color="inherit"
                        onClick={() => setItemData(newName(), {})}
                    >
                        <AddIcon />
                    </IconButton>
                </Tooltip>
            </Box>
            {
                items.map(e => (
                    component(e.name, e.data, newData => setItemData(e.name, newData))
                ))
            }
        </>
    )
}
