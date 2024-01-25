import { ListItemButton, ListItemIcon, ListItemText } from "@mui/material"
import SendIcon from '@mui/icons-material/Send';

export const ExperimentRow = ({ name }) => {
    return (
        <>
            <ListItemButton>
                <ListItemIcon>
                    <SendIcon />
                </ListItemIcon>
                <ListItemText primary={name} />
            </ListItemButton>
        </>
        // <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
        //   {e.name}
        // </Typography>
    )
}