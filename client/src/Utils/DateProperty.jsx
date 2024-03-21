import { DatePicker } from "@mui/x-date-pickers"
import dayjs from 'dayjs';

export const DateProperty = ({ label, field, data, setData }) => {
    return (
        <DatePicker
            label={label}
            slotProps={{
                textField: {
                    fullWidth: false,
                    size: 'small',
                    inputProps: {
                        style: {
                            width: '100px'
                        }
                    }
                }
            }}
            format='DD/MM/YYYY'
            value={dayjs(data)}
            onChange={(val) => setData(val)}
        />
    )
}