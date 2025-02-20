import React, { ReactNode } from "react";
import { canvas, LatLngExpression } from "leaflet";
import {
    Polyline
} from "react-leaflet";

export const DashedPolyline = ({
    positions,
    children,
    ...props
}: {
    positions: LatLngExpression[],
    children?: ReactNode,
}) => (
    <Polyline
        positions={positions}
        color={'black'}
        weight={2}
        dashArray={'4 4'}
        renderer={canvas({ padding: 0.2, tolerance: 10 })}
        {...props}
    >
        {children}
    </Polyline>
)

