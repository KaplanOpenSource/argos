import { LatLng, LatLngBounds, latLng, latLngBounds } from "leaflet"
import { RealMapName } from "../constants/constants";
import { circleToPolygon } from "../IO/ShapesToGeoJson";
import { ICoordinates, IExperiment } from "../types/types";

export const geographySpan = (experiment: IExperiment): LatLngBounds => {
    const coords: LatLng[] = [];
    for (const x of experiment?.imageEmbedded || []) {
        if (x?.latsouth && x?.lngwest) {
            coords.push(latLng(x?.latsouth, x?.lngwest));
        }
        if (x?.latnorth && x?.lngeast) {
            coords.push(latLng(x?.latnorth, x?.lngeast));
        }
    }

    for (const trialType of experiment?.trialTypes || []) {
        for (const trial of trialType?.trials || []) {
            for (const dev of trial?.devicesOnTrial || []) {
                if (dev?.location?.name === RealMapName) {
                    const [lat, lng]: ICoordinates | [] = dev?.location?.coordinates || [];
                    if (lat && lng) {
                        coords.push(latLng(lat, lng));
                    }
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
    const good: LatLng[] = coords.filter(x => x && isFinite(x.lat) && isFinite(x.lng));
    if (good.length) {
        return latLngBounds(good);
    }
    return latLngBounds([32.071128, 34.769729], [32.091128, 34.789729]);
}