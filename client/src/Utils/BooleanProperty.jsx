import { FormControlLabel, FormGroup, Switch } from "@mui/material";

export const BooleanProperty = ({ data, setData, label, ...restProps }) => (
    <FormGroup>
        <FormControlLabel
            control={
                <Switch
                    checked={data || false}
                    onChange={(e) => {
                        e.stopPropagation();
                        setData(!!e.target.checked);
                    }}
                />
            }
            label={label}
            {...restProps}
        />
    </FormGroup>
)