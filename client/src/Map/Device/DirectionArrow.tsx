import React, { useState } from "react";
import { Polygon, useMapEvents } from "react-leaflet";
import { ICoordinates, IDeviceOnTrial } from "../../types/types";
import { LatLngBounds } from "leaflet";

export const DirectionArrow = ({
    deviceOnTrial,
}: {
    deviceOnTrial: IDeviceOnTrial,
}) => {
    const boundsToLength = (bounds: LatLngBounds) => {
        return bounds.getNorthEast().distanceTo(bounds.getCenter()) / 1000000;
    }
    const mapObj = useMapEvents({
        zoom: e => setLen(boundsToLength(e.target.getBounds())),
    });
    const [len, setLen] = useState(() => boundsToLength(mapObj.getBounds()));

    const directionAngles = parseFloat(deviceOnTrial.attributes?.find(a => a.name === 'direction')?.value);
    const { coordinates } = deviceOnTrial?.location || {};

    if (!isFinite(directionAngles) || !coordinates) {
        return null;
    }

    const directionRad = directionAngles * Math.PI / 180;

    const [y0, x0] = coordinates;
    const sin = Math.sin(directionRad);
    const cos = Math.cos(directionRad);

    const arrow: ICoordinates[] = [
        [0, 0],
        [0, 1],
        [0.2, 0.8],
        [0, 1],
        [-0.2, 0.8],
        [0, 1],
    ];

    const positions: ICoordinates[] = arrow.map(([y, x]) => {
        return [y0 + x * len * sin + y * len * cos, x0 + x * len * cos - y * len * sin];
    });

    return (
        <Polygon
            positions={positions}
        />)
}