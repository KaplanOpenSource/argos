import React, { ReactNode } from "react";
import { LatLngExpression } from "leaflet";
import { CircleMarker } from "react-leaflet";

export const ChosenMarker = ({ center, children }: { center: LatLngExpression, children?: ReactNode }) => (
    <CircleMarker
        key='chosen'
        center={center}
        radius={9}
        color={'red'}
        opacity={1}
        dashArray={'4 4'}
        weight={2}
    >
        {children}
    </CircleMarker>
)

