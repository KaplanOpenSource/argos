import { FormControlLabel, FormGroup, Switch } from "@mui/material";
import { TooltipItem } from "../Utils/TooltipItem";

export const BooleanProperty = ({ data, setData, label, tooltipTitle = "", ...restProps }) => {
  const value = (!data || data === 'false' || data === '0') ? false : true; // for legacy experiments
  const style = data !== undefined ? {} : {
    '& .MuiSwitch-track': {
      position: 'relative',
      background: (theme) =>
        `linear-gradient(
              45deg,
              ${theme.palette.mode === 'dark' ? '#fff' : '#000'} 25%,
              transparent 25%,
              transparent 50%,
              ${theme.palette.mode === 'dark' ? '#fff' : '#000'} 50%,
              ${theme.palette.mode === 'dark' ? '#fff' : '#000'} 75%,
              transparent 75%,
              transparent
            )`,
      backgroundSize: '20px 20px',
      '&:before, &:after': {
        content: '""',
        position: 'absolute',
        top: '50%',
        transform: 'translateY(-50%)',
        width: '100%',
        height: '100%',
      },
      '&:before': {
        left: '-1px',
      },
      '&:after': {
        right: '-1px',
      },
    },
    '& .MuiSwitch-thumb': {
      backgroundColor: '#bbb',
    },
  };

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
              sx={{ ...style }}
            />
          }
          label={label}
          {...restProps}
        />
      </FormGroup>
    </TooltipItem>
  )
}