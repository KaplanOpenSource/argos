import { useMapEvents } from "react-leaflet";

export const MapClickEventer = ({ onMapClick }) => {
    const mapObj = useMapEvents({
        click: (e) => {
            if (e.originalEvent.target === mapObj._container) {
                const latlng = [e.latlng.lat, e.latlng.lng];
                onMapClick(latlng, mapObj);
            }
        },
    });

    return null;
}