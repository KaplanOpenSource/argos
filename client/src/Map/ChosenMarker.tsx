import { LatLngExpression } from "leaflet";
import React, { ReactNode } from "react";
import { CircleMarker } from "react-leaflet";

export const ChosenMarker = ({
  center,
  color = 'red',
  children,
}: {
  center: LatLngExpression,
  color?: string,
  children?: ReactNode,
}) => (
  <CircleMarker
    key='chosen'
    center={center}
    radius={9}
    color={color}
    opacity={1}
    dashArray={'4 4'}
    weight={2}
  >
    {children}
  </CircleMarker>
)

