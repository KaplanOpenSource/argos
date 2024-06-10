import { FormControlLabel, FormGroup, Switch, Tooltip } from "@mui/material";

export const BooleanProperty = ({ data, setData, label, tooltipTitle = "", ...restProps }) => {
    const value = (!data || data === 'false' || data === '0') ? false : true; // for legacy experiments
    return (
        <Tooltip
            title={tooltipTitle}
            placement='top'
        >
            <FormGroup>
                <FormControlLabel
                    control={
                        <Switch
                            checked={value}
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
}