import { useState } from "react";
import { ButtonTooltip } from "./ButtonTooltip";
import { MenuActions } from "./MenuActions";

export const ButtonMenu = ({ tooltip, children, menuItems, ...restProps }) => {
  const [anchorEl, setAnchorEl] = useState<Element | null>(null);
  return (
    <>
      <ButtonTooltip
        tooltip={tooltip}
        onClick={(e: MouseEvent) => setAnchorEl(e.currentTarget as (Element | null))}
        {...restProps}
      >
        {children}
      </ButtonTooltip>
      <MenuActions
        anchorEl={anchorEl}
        setAnchorEl={setAnchorEl}
        menuItems={menuItems}
      />
    </>
  )
}