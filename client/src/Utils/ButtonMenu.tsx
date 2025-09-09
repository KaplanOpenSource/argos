import { MouseEvent, useState } from 'react';
import { ButtonTooltip } from "./ButtonTooltip";
import { IMenuActionItem, MenuActions } from "./MenuActions";

export const ButtonMenu = ({
  tooltip,
  menuItems,
  children,
  ...restProps
}: {
  tooltip: any,
  menuItems: IMenuActionItem[],
  children: any,
}) => {
  const [anchorEl, setAnchorEl] = useState<Element | null>(null);
  return (
    <>
      <ButtonTooltip
        tooltip={tooltip}
        onClick={(e: MouseEvent<HTMLButtonElement>) => setAnchorEl(e.currentTarget as (Element | null))}
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