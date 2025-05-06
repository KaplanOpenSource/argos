import { Menu, MenuItem } from "@mui/material";
import { useState } from "react";
import { ButtonTooltip } from "./ButtonTooltip";

export const ButtonMenu = ({ tooltip, children, menuItems, ...restProps }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  return (
    <>
      <ButtonTooltip
        tooltip={tooltip}
        onClick={(e) => setAnchorEl(e.currentTarget)}
        {...restProps}
      >
        {children}
      </ButtonTooltip>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={() => setAnchorEl(null)}
      >
        {menuItems.map(({ name, action }, i) => {
          return (
            <MenuItem
              key={name + '' + i}
              onClick={e => {
                e.stopPropagation();
                setAnchorEl(null);
                action();
              }}
            >
              {name}
            </MenuItem>
          )
        })}
      </Menu>
    </>
  )
}