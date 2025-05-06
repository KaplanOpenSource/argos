import React, { ReactNode } from 'react';
import { Marker, Tooltip } from "react-leaflet";
import { CustomIcon } from './CustomIcon';

let dragStartLoc;

export const MarkedPoint = ({
  location,
  dragLocation,
  setLocation,
  locationToShow,
  children,
  ...restProps
}: {
  location: [number, number], // [lat, lng]
  dragLocation?: (latlng: [number, number]) => void,
  setLocation?: (latlng: [number, number]) => void | boolean,
  locationToShow?: string,
  children?: ReactNode
}) => {
  let locationToShowStr: string;
  if (!locationToShow) {
    locationToShowStr = JSON.stringify(location.map(l => Math.round(l * 1e9) / 1e9)).replace(/,/g, ', ');
  } else {
    locationToShowStr = locationToShow;
  }

  return (
    <Marker
      position={location}
      title={locationToShowStr.replace(/<br\/>/g, '\n')}
      draggable={true}
      eventHandlers={{
        drag: (e) => {
          if (dragLocation) {
            const { lat, lng } = e.target.getLatLng() as { lat: number, lng: number };
            dragLocation([lat, lng]);
          }
        },
        dragend: (e) => {
          if (setLocation) {
            const { lat, lng } = e.target.getLatLng() as { lat: number, lng: number };
            const res = setLocation([lat, lng]);
            if (dragStartLoc && res === false) { // when setLocation returns false - revert to last position
              e.target.setLatLng(dragStartLoc);
            }
          }
          dragStartLoc = undefined;
        },
        dragstart: (e) => {
          dragStartLoc = e.target.getLatLng();
        }
      }}
      icon={CustomIcon()}
      {...restProps}
    >
      <Tooltip
      // permanent
      >
        {locationToShowStr.split('<br/>').map((l, i) => (
          <span key={i}>{l}<br /></span>
        ))}
      </Tooltip>
      {children}
    </Marker >
  )
}
