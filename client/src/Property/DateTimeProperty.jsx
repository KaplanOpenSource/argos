import { Tooltip } from "@mui/material";
import { DateTimePicker } from "@mui/x-date-pickers"
import dayjs from 'dayjs';

export const DateTimeProperty = ({ label, data, setData, tooltipTitle = "", ...restProps }) => {
    let value = null;
    try {
        value = data ? dayjs(data) : null;
    } catch (e) {
        console.trace('problem on date', label, data, e);
    }

    const setValue = (val) => {
        setData(val.toISOString());
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
                <DateTimePicker
                    label={label}
                    slotProps={{
                        textField: {
                            fullWidth: false,
                            size: 'small',
                            inputProps: {
                                style: {
                                    width: '180px'
                                }
                            }
                        },
                        actionBar: {
                            actions: ['today', 'clear', 'accept'],
                        },
                    }}
                    format='DD/MM/YYYY hh:mm:ss'
                    value={value}
                    onChange={setValue}
                    {...restProps}
                />
            </div>
        </Tooltip>
    )
}