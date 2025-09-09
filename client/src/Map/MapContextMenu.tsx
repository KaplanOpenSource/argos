import { Menu, MenuItem } from '@mui/material';
import { useState } from 'react';
import { useMapEvent } from "react-leaflet";
import { IMenuCallbackItem } from '../Utils/ContextMenu';

export const MapContextMenu = ({
  menuItems,
}: {
  menuItems: IMenuCallbackItem[],
}) => {
  const [menuPosition, setMenuPosition] = useState<{ mouseX: number; mouseY: number } | null>(null);

  useMapEvent('contextmenu', (e) => {
    e.originalEvent.preventDefault(); // prevent default browser context menu
    setMenuPosition({
      mouseX: e.originalEvent.clientX,
      mouseY: e.originalEvent.clientY,
    });
  });

  const handleClose = () => {
    setMenuPosition(null);
  };

  return (
    <Menu
      id="map-context-menu"
      keepMounted
      open={menuPosition !== null}
      onClose={handleClose}
      anchorReference="anchorPosition"
      anchorPosition={
        menuPosition !== null
          ? { top: menuPosition.mouseY, left: menuPosition.mouseX }
          : undefined
      }
    >
      {menuItems.map(({ label, callback }) => (
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
      ))}
      <MenuItem onClick={handleClose}>Cancel</MenuItem>
    </Menu>
  );
};
