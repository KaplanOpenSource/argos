import { useEffect } from "react";
import { useMap } from "react-leaflet";

export const MapContextMenu = ({ menuItems }) => {
  const mapObj = useMap();
  useEffect(() => {
    mapObj.contextmenu.removeAllItems();
    for (const { label, callback } of menuItems) {
      mapObj.contextmenu.addItem({
        text: label,
        callback: (e) => {
          callback(e, [e.latlng.lat, e.latlng.lng]);
        },
      });
    }
  }, [menuItems]);

  return null;
}