import { latLng, latLngBounds } from "leaflet"
import { RealMapName } from "../constants/constants";

export const geographySpan = (experiment, trial) => {
    const coords = [];
    for (const x of experiment?.imageEmbedded || []) {
        coords.push(
            latLng(x.latsouth, x.lngwest),
            latLng(x.latnorth, x.lngeast),
        );
    }
    if (trial) {
        for (const x of trial?.devicesOnTrial || []) {
            if (x.location.name === RealMapName) {
                coords.push(latLng(x.location.coordinates[0], x.location.coordinates[1]));
            }
        }
    }
    const good = coords.filter(x => x && isFinite(x.lat) && isFinite(x.lng));
    if (good.length) {
        return latLngBounds(good);
    }
    return latLngBounds([32.071128, 34.769729],[32.091128, 34.789729]);
}
