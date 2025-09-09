import { Menu, MenuItem } from '@mui/material';
import { LatLng } from 'leaflet';
import { useState } from 'react';
import { useMapEvent } from "react-leaflet";

export type IMapMenuCallbackItem = {
  label: string;
  callback: (latlng: LatLng) => void;
};


export const MapContextMenu = ({
  menuItems,
}: {
  menuItems: IMapMenuCallbackItem[],
}) => {
  const [menuPosition, setMenuPosition] = useState<{ x: number; y: number, latlng: LatLng } | null>(null);

  useMapEvent('contextmenu', (e) => {
    e.originalEvent.preventDefault(); // prevent default browser context menu
    setMenuPosition({ x: e.originalEvent.clientX, y: e.originalEvent.clientY, latlng: e.latlng });
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
          ? { top: menuPosition.y, left: menuPosition.x }
          : undefined
      }
      onContextMenu={e => {
        e.stopPropagation();
        e.preventDefault();
        handleClose();
      }}
    >
      {(menuPosition?.latlng ? menuItems : []).map(({ label, callback }) => (
        <MenuItem
          onClick={(e) => {
            e.stopPropagation();
            e.preventDefault();
            callback(menuPosition?.latlng!);
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
