import { Tooltip } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers"
import dayjs from 'dayjs';

export const DateProperty = ({ label, data, setData, tooltipTitle = "", ...restProps }) => {
    let value = null;
    try {
        value = data ? dayjs(data) : null;
    } catch (e) {
        console.trace('problem on date', label, data, e);
    }

    const setValue = (val) => {
        setData(val);
    }

    return (
        <Tooltip
            title={tooltipTitle}
            placement='top'
        >
            <div
                style={{
                    display: 'inline',
                }}
                onClick={e => e.stopPropagation()}
            >
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
                        },
                        actionBar: {
                            actions: ['today', 'clear'],
                        },
                    }}
                    format='DD/MM/YYYY'
                    value={value}
                    onChange={setValue}
                    {...restProps}
                />
            </div>
        </Tooltip>
    )
}