import { FormControlLabel, FormGroup, Switch } from "@mui/material";
import { TooltipItem } from "../Utils/TooltipItem";

export const BooleanProperty = ({ data, setData, label, tooltipTitle = "", ...restProps }) => {
  const value = (!data || data === 'false' || data === '0') ? false : true; // for legacy experiments
  return (
    <TooltipItem
      title={tooltipTitle}
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
              onClick={e => e.stopPropagation()}
            />
          }
          label={label}
          {...restProps}
        />
      </FormGroup>
    </TooltipItem>
  )
}