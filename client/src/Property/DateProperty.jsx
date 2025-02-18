import { DatePicker } from "@mui/x-date-pickers"
import dayjs from 'dayjs';
import { TooltipItem } from "../Utils/TooltipItem";

export const DateProperty = ({ label, data, setData, tooltipTitle = "", ...restProps }) => {
    let value = null;
    try {
        if (data) {
            if (data.$d) {
                value = dayjs(data.$d);
            } else {
                value = dayjs(data);
            }
        }
    } catch (e) {
        console.trace('problem on date', label, data, e);
    }

    const setValue = (val) => {
        setData(val.startOf('day').add(12, 'hours').toISOString());
    }

    return (
        <TooltipItem
            title={tooltipTitle}
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
                            actions: ['today', 'clear', 'accept'],
                        },
                    }}
                    format='DD/MM/YYYY'
                    value={value}
                    onChange={setValue}
                    {...restProps}
                />
            </div>
        </TooltipItem>
    )
}