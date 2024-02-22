import { DatePicker } from "@mui/x-date-pickers"
import dayjs from 'dayjs';
import { useContext } from "react";
import { experimentContext } from "../Experiment/ExperimentProvider";

export const DateProperty = ({ label, field, data, path, experimentName }) => {
    const { changeExperiment } = useContext(experimentContext);
    return (
        <DatePicker
            label={label}
            slotProps={{
                textField: {
                    fullWidth: false, size: 'small',
                    inputProps: {
                        style: {
                            width: '100px'
                        }
                    }
                }
            }}
            format='DD/MM/YYYY'
            value={dayjs(data[field])}
            onChange={(val) => changeExperiment(experimentName, { op: "replace", path, value: val.toISOString() })}
        />
    )
}