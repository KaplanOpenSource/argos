import { useContext, useEffect } from "react";
import { useMapEvents } from "react-leaflet";
import { experimentContext } from "../Experiment/ExperimentProvider";

export const MapPositionOnUrl = ({ }) => {
    // const { selection, setSelection, currTrial, setTrialData } = useContext(experimentContext);

    const mapObj = useMapEvents({
        move: () => {
            const u = new URL(window.location);
            u.searchParams.set('lat', mapObj.getCenter().lat);
            u.searchParams.set('lng', mapObj.getCenter().lng);
            u.searchParams.set('z', mapObj.getZoom());
            window.history.replaceState(null, null, u.href);
        },

    });

    useEffect(() => {
        const u = new URL(window.location);
        const lat = parseFloat(u.searchParams.get('lat'));
        const lng = parseFloat(u.searchParams.get('lng'));
        const z = parseFloat(u.searchParams.get('z'));
        if (isFinite(lat) && isFinite(lng) && isFinite(z)) {
            mapObj.setView([lat, lng], z);
        }
    }, []);

    return (
        <>
        </>
    )
}