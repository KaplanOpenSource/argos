import {
  IconButton,
  IconButtonProps,
} from '@mui/material';
import { DomEvent } from 'leaflet';
import React, { MouseEvent } from 'react';
import { TooltipItem } from './TooltipItem';

export const ButtonTooltip = ({
  onClick,
  tooltip,
  disabled = false,
  closeTooltipOnClick = false,
  children,
  ...restProps
}: {
  onClick: (e: MouseEvent<HTMLButtonElement>) => void,
  tooltip: any,
  disabled?: boolean,
  closeTooltipOnClick?: boolean,
  children: any
} & IconButtonProps) => {
  const [open, setOpen] = React.useState(false);

  const button = (
    <IconButton
      size="small"
      onClick={(e) => {
        e.stopPropagation();
        DomEvent.stop(e as any);
        if (closeTooltipOnClick) {
          setOpen(false);
        }
        if (onClick) {
          onClick(e);
        }
      }}
      disabled={disabled}
      {...restProps}
    >
      {children}
    </IconButton>
  );

  return (
    <TooltipItem
      open={open}
      onOpen={() => setOpen(true)}
      onClose={() => setOpen(false)}
      title={tooltip}
      arrow={true}
    >
      {/* {disabled
                ?  */}
      <div style={{ display: 'inline-block' }}>{button}</div>
      {/* : button
            } */}
    </TooltipItem>
  )
}

