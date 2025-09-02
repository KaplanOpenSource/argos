import { Menu, MenuItem } from '@mui/material';
import React, { ReactNode } from 'react';

export type IMenuCallbackItem = {
  label: string;
  callback: () => void;
};

export const ContextMenu = ({
  menuItems,
  children,
}: {
  menuItems: IMenuCallbackItem[],
  children: ReactNode,
}) => {
  const [menuAnchorElement, setMenuAnchorElement] = React.useState<Element | null>(null);

  const handleClose = () => {
    setMenuAnchorElement(null);
  };

  return (
    <>
      <Menu
        id="simple-menu"
        anchorEl={menuAnchorElement}
        keepMounted
        open={Boolean(menuAnchorElement)}
        onClose={handleClose}
      >
        {
          menuItems.map(({ label, callback }) => (
            <MenuItem
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                callback();
                handleClose();
              }}
              key={label}
            >
              {label}
            </MenuItem>
          ))
        }
        <MenuItem onClick={handleClose}>Cancel</MenuItem>
      </Menu>
      <div
        onContextMenu={(e) => {
          e.stopPropagation();
          e.preventDefault();
          setMenuAnchorElement(e.currentTarget);
        }}
      >
        {children}
      </div>
    </>
  )
}

