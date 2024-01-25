import { ListItemButton, ListItemIcon, ListItemText } from "@mui/material"
import SendIcon from '@mui/icons-material/Send';
import dayjs from 'dayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

export const ExperimentRow = ({ name, data, setData }) => {
    const { startDate, endDate } = data;
    return (
        <>
            <ListItemButton>
                <ListItemIcon>
                    <SendIcon />
                </ListItemIcon>
                <ListItemText primary={name} />
                <DatePicker
                    label="Start Date"
                    value={dayjs(data.startDate)}
                    onChange={(val) => setData({ ...data, startDate: val })}
                />
                <DatePicker
                    label="End Date"
                    value={dayjs(data.endDate)}
                    onChange={(val) => setData({ ...data, endDate: val })}
                />
            </ListItemButton>
        </>
        // <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
        //   {e.name}
        // </Typography>
    )
}