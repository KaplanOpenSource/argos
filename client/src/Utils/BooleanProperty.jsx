import { FormControlLabel, FormGroup, Switch, Tooltip } from "@mui/material";

export const BooleanProperty = ({ data, setData, label, tooltipTitle = "", ...restProps }) => (
    <Tooltip
        title={tooltipTitle}
        placement='top'
    >
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
    </Tooltip>
)