import React from 'react';
import {
    Paper
} from "@mui/material";
import { useCurrMouseLocation } from '../Context/CurrMouseLocation';

export const MapCoordinates = ({ showAsLatLong = true }) => {
    const { latlng } = useCurrMouseLocation();

    const round = (num, digits) => {
        const c = 10 ** digits;
        return Math.round(num * c) / c;
    }

    let str = '';
    if (showAsLatLong) {
        str = `${round(latlng.lat, 6)} ${latlng.lat < 0 ? 'S' : 'N'}, ${round(latlng.lng, 6)} ${latlng.lng < 0 ? 'W' : 'E'}`;
    } else {
        str = `${round(latlng.lng, 3)}, ${round(latlng.lat, 3)}`;
    }

    return (
        <Paper style={{ paddingTop: '15px', paddingBottom: '15px', paddingLeft: '5px', paddingRight: '5px', }}>
            <span style={{
                fontFamily: 'Helvetica Neue, Arial, Helvetica, sans-serif',
                fontSize: '12px',
                lineHeight: '18px',
            }}>
                {str}
            </span>
        </Paper>
    )
}

