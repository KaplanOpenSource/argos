import { LatLng, LatLngBounds, latLng, latLngBounds } from "leaflet"
import { DEG_TO_METERS, RealMapName } from "../constants/constants";
import { ICoordinates, IExperiment, ITrial } from "../types/types";
import { circleToPolygon } from "../IO/ShapesToGeoJson";

export class CoordsSpan {
    private readonly coords = new Map<string, LatLng[]>;

    public fromExperiment(experiment: IExperiment) {
        for (const x of experiment?.imageEmbedded || []) {
            this.addCoord(x?.latsouth, x?.lngwest);
            this.addCoord(x?.latnorth, x?.lngeast);
        }

        for (const trialType of experiment?.trialTypes || []) {
            for (const trial of trialType?.trials || []) {
                this.fromTrial(trial);
            }
        }

        for (const shape of experiment?.shapes || []) {
            for (const c of shape?.coordinates || []) {
                if (c) {
                    this.addCoord(c[0], c[1]);
                }
            }
            if (shape?.center && shape?.center.length === 2 && shape?.radius) {
                // GeoJson circle coords are in reverse
                const center = shape?.center.slice(0, 2).reverse() as ICoordinates;
                const circle = circleToPolygon(center, shape?.radius, 20);
                for (const c of circle || []) {
                    if (c) {
                        this.addCoord(c[0], c[1]);
                    }
                }
            }
        }
        return this;
    }

    public fromTrial(trial: ITrial) {
        for (const dev of trial?.devicesOnTrial || []) {
            // if (dev?.location?.name === mapName) {
            const [lat, lng]: ICoordinates | [] = dev?.location?.coordinates || [];
            this.addCoord(lat, lng, dev?.location?.name || RealMapName);
            // }
        }
        return this;
    }

    getMaps() {
        if (this.coords.size === 0) {
            return [RealMapName];
        }
        return [...this.coords.keys()];
    }

    getFirstStandalone() {
        const names = this.getMaps().filter(x => x !== RealMapName);
        return names.length > 0 ? names[0] : undefined;
    }

    getBounds(mapName: string = RealMapName): LatLngBounds | undefined {
        const coordMap = this.coords.get(mapName) || [];
        const good: LatLng[] = coordMap.filter(x => x && isFinite(x.lat) && isFinite(x.lng));
        if (good.length === 0) {
            return undefined;
            // return latLngBounds([32.071128, 34.769729], [32.091128, 34.789729]);
        }
        return latLngBounds(good);
    }

    private minmax(bounds: LatLngBounds) {
        const n = bounds.getNorth(), s = bounds.getSouth();
        const w = bounds.getWest(), e = bounds.getEast();
        const vmin = Math.min(n, s), vmax = Math.max(n, s);
        const hmin = Math.min(w, e), hmax = Math.max(w, e);
        return { vmin, vmax, hmin, hmax, vsize: vmax - vmin, hsize: hmax - hmin };
    }

    fitBounds(mapObject: L.Map, mapName: string = RealMapName) {
        let bounds = this.getBounds(mapName);
        if (bounds) {
            const { vmin, vmax, hmin, hmax, vsize, hsize } = this.minmax(bounds);
            if (hsize === 0 || vsize === 0) {
                let buf = 1000 / DEG_TO_METERS;
                if (mapName !== RealMapName) {
                    // const mapsize = this.minmax(mapObject.getBounds());
                    // buf = Math.min(mapsize.hsize, mapsize.vsize) / 3;
                    buf = 1;
                }
                bounds = latLngBounds(
                    latLng(vmin - buf, hmin - buf),
                    latLng(vmax + buf, hmax + buf),
                );
            }
            mapObject.fitBounds(bounds);
        }
    }

    private addCoord(lat: number | undefined, lng: number | undefined, mapName: string = RealMapName) {
        if (lat && lng) {
            let coordMap = this.coords.get(mapName);
            if (!coordMap) {
                coordMap = [];
                this.coords.set(mapName, coordMap);
            }
            coordMap.push(latLng(lat, lng));
        }
    }
}
