import { DatePicker } from "@mui/x-date-pickers"
import dayjs from 'dayjs';

export const DateProperty = ({ label, field, data, setData }) => {
    return (
        <DatePicker
            label={label}
            slotProps={{ textField: { size: 'small' } }}
            format='DD/MM/YYYY'
            value={dayjs(data[field])}
            onChange={(val) => setData({ ...data, [field]: val })}
        />
    )
}