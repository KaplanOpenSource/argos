import { latLng, latLngBounds } from "leaflet"
import { RealMapName } from "../constants/constants";
import { circleToPolygon } from "../IO/ShapesToGeoJson";

export const geographySpan = (experiment) => {
    const coords = [];
    for (const x of experiment?.imageEmbedded || []) {
        coords.push(
            latLng(x?.latsouth, x?.lngwest),
            latLng(x?.latnorth, x?.lngeast),
        );
    }
    for (const trialType of experiment?.trialTypes || []) {
        for (const trial of trialType?.trials || []) {
            for (const dev of trial?.devicesOnTrial || []) {
                if (dev?.location?.name === RealMapName) {
                    const [lat, lng] = dev?.location?.coordinates || [];
                    coords.push(latLng(lat, lng));
                }
            }
        }
    }
    for (const shape of experiment?.shapes || []) {
        for (const c of shape?.coordinates || []) {
            if (c) {
                coords.push(latLng(c[0], c[1]));
            }
        }
        if (shape?.center && shape?.radius) {
            // GeoJson circle coords are in reverse
            const circle = circleToPolygon(shape?.center.slice().reverse(), shape?.radius, 20);
            for (const c of circle || []) {
                if (c) {
                    coords.push(latLng(c[0], c[1]));
                }
            }
        }
    }
    console.log('geographySpan', coords);
    const good = coords.filter(x => x && isFinite(x.lat) && isFinite(x.lng));
    if (good.length) {
        return latLngBounds(good);
    }
    return latLngBounds([32.071128, 34.769729], [32.091128, 34.789729]);
}
