import { LatLng, LatLngBounds, latLng, latLngBounds } from "leaflet"
import { RealMapName } from "../constants/constants";
import { ICoordinates, IExperiment, ITrial } from "../types/types";
import { circleToPolygon } from "../IO/ShapesToGeoJson";

export class CoordsSpan {
    private readonly coords: LatLng[] = [];

    public fromExperiment(experiment: IExperiment) {
        for (const x of experiment?.imageEmbedded || []) {
            if (x?.latsouth && x?.lngwest) {
                this.coords.push(latLng(x?.latsouth, x?.lngwest));
            }
            if (x?.latnorth && x?.lngeast) {
                this.coords.push(latLng(x?.latnorth, x?.lngeast));
            }
        }

        for (const trialType of experiment?.trialTypes || []) {
            for (const trial of trialType?.trials || []) {
                this.fromTrial(trial, RealMapName);
            }
        }

        for (const shape of experiment?.shapes || []) {
            for (const c of shape?.coordinates || []) {
                if (c) {
                    this.coords.push(latLng(c[0], c[1]));
                }
            }
            if (shape?.center && shape?.center.length === 2 && shape?.radius) {
                // GeoJson circle coords are in reverse
                const center = shape?.center.slice(0, 2).reverse() as ICoordinates;
                const circle = circleToPolygon(center, shape?.radius, 20);
                for (const c of circle || []) {
                    if (c) {
                        this.coords.push(latLng(c[0], c[1]));
                    }
                }
            }
        }
        return this;
    }

    public fromTrial(trial: ITrial, mapName: string) {
        for (const dev of trial?.devicesOnTrial || []) {
            if (dev?.location?.name === mapName) {
                const [lat, lng]: ICoordinates | [] = dev?.location?.coordinates || [];
                if (lat && lng) {
                    this.coords.push(latLng(lat, lng));
                }
            }
        }
        return this;
    }

    getBounds() {
        const good: LatLng[] = this.coords.filter(x => x && isFinite(x.lat) && isFinite(x.lng));
        if (good.length) {
            return latLngBounds(good);
        }
        return latLngBounds([32.071128, 34.769729], [32.091128, 34.789729]);
    }
}
