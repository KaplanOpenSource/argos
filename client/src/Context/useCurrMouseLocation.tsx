import {
    useMapEvents,
} from "react-leaflet";
import { create } from 'zustand';

type CurrMouseLocationStore = {
    latlng: { lat: number, lng: number }, // change to ICoordinates
    setLatlng: (lat: number, lng: number) => void,
};

export const useCurrMouseLocation = create<CurrMouseLocationStore>()((set, get) => ({
    latlng: { lat: 0, lng: 0 },
    setLatlng: (lat: number, lng: number) => {
        set((state) => ({
            latlng: { lat, lng },
        }))
    },
}))

export const CurrMouseLocation = () => {
    const { setLatlng } = useCurrMouseLocation();

    const mapObj = useMapEvents({
        mousemove: (e) => setLatlng(e.latlng.lat, e.latlng.lng),
    });

    return null;
}

