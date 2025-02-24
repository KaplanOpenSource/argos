import React from "react";
import { Polygon, useMapEvents } from "react-leaflet";
import { ICoordinates, IDeviceOnTrial } from "../../types/types";

export const DirectionArrow = ({
    deviceOnTrial,
}: {
    deviceOnTrial: IDeviceOnTrial,
}) => {
    const mapObj = useMapEvents({
    });
    const directionAngles = parseFloat(deviceOnTrial.attributes?.find(a => a.name === 'direction')?.value);
    const { coordinates } = deviceOnTrial?.location || {};

    if (!isFinite(directionAngles) || !coordinates) {
        return null;
    }

    const directionRad = directionAngles * Math.PI / 180;

    const [y0, x0] = coordinates;
    const sin = Math.sin(directionRad);
    const cos = Math.cos(directionRad);
    const len = 1 / 10;

    const arrow: ICoordinates[] = [
        [0, 0],
        [0, len],
        [len / 5, len - len / 5],
        [0, len],
        [-len / 5, len - len / 5],
        [0, len],
    ];

    const positions: ICoordinates[] = arrow.map(([y, x]) => {
        return [y0 + x * sin + y * cos, x0 + x * cos - y * sin];
    });

    return (
        <Polygon
            positions={positions}
        />)
}