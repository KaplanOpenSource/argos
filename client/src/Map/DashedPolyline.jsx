import React from "react";
import { canvas } from "leaflet";
import {
  Polyline
} from "react-leaflet";

export const DashedPolyline = ({ positions, children, ...props }) => (
    <Polyline
      positions={positions.map(p => p.length ? p : [p.lat, p.lng])}
      color={'black'}
      weight={2}
      dashArray={'4 4'}
      renderer={canvas({ padding: 0.2, tolerance: 10 })}
      {...props}
    >
      {children}
    </Polyline>
  )

