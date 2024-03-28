import { Tooltip } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers"
import dayjs from 'dayjs';

export const DateProperty = ({ label, data, setData, tooltipTitle = "", ...restProps }) => {
    return (
        <Tooltip
            title={tooltipTitle}
            placement='top'
        >
            <div>
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
                    {...restProps}
                />
            </div>
        </Tooltip>
    )
}