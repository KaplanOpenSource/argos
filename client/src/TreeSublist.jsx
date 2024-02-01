import { Box, IconButton, Typography } from "@mui/material";
import AddIcon from '@mui/icons-material/Add';

import dayjs from 'dayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { TrailSet } from "./TrailSet";
import { TreeRow } from "./TreeRow";
import { DeviceType } from "./DeviceType";

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
                <Typography variant="body2" sx={{ fontWeight: 'inherit', flexGrow: 1 }}>
                    {fieldName}
                </Typography>
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
            </Box>
            {
                items.map(e => (
                    component(e.name, e.data, newData => setItemData(e.name, newData))
                ))
            }
        </>
    )
}
