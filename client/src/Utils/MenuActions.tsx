import { Menu, MenuItem } from "@mui/material";

export type IMenuActionItem = {
  name: string;
  action: () => void;
};

export const MenuActions = ({
  anchorEl,
  setAnchorEl,
  menuItems,
}: {
  anchorEl: Element | null,
  setAnchorEl: (el: Element | null) => void,
  menuItems: IMenuActionItem[],
}) => {
  const open = Boolean(anchorEl);
  return (
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
  )
}