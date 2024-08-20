import { DEG_TO_METERS } from "../constants/constants";
import { ICoordinates } from "../types/types";

// Convert circle to polygon with specified vertices
export const circleToPolygon = (center: ICoordinates, radius: number, numVertices: number): Array<ICoordinates> => {
    const angleStep = (2 * Math.PI) / numVertices;
    const coordinates: Array<ICoordinates> = [];

    const cy = center[0];
    const cx = center[1];

    for (let i = 0; i < numVertices; i++) {
        const angle = i * angleStep;
        const dx = radius * Math.cos(angle);
        const dy = radius * Math.sin(angle);

        // Convert meters to degrees
        const vertex = [
            cy + dy / DEG_TO_METERS,
            cx + (dx / DEG_TO_METERS) / Math.cos(cy * Math.PI / 180)
        ];

        coordinates.push([vertex[1], vertex[0]]);
    }

    coordinates.push(coordinates[0]); // Close the polygon
    return coordinates;
};

// Convert shapes data to GeoJSON
export const shapesToGeoJSON = (shapesData, numVertices = 360) => {
    const geoJson = {
        type: "FeatureCollection",
        features: shapesData.map(shape => {
            if (shape.type === 'Polygon') {
                // GeoJSON coordinates are [longitude, latitude]
                const coordinates = shape.coordinates.map(coord => [coord[1], coord[0]]);
                coordinates.push(coordinates[0]);
                return {
                    type: "Feature",
                    geometry: {
                        type: "Polygon",
                        coordinates: [coordinates]
                    },
                    properties: {}
                };
            } else if (shape.type === 'Polyline') {
                return {
                    type: "Feature",
                    geometry: {
                        type: "LineString",
                        coordinates: shape.coordinates.map(coord => [coord[1], coord[0]]) // GeoJSON coordinates are [longitude, latitude]
                    },
                    properties: {}
                };
            } else if (shape.type === 'Circle') {
                return {
                    type: "Feature",
                    geometry: {
                        type: "Polygon",
                        coordinates: [
                            circleToPolygon(shape.center, shape.radius, numVertices)
                        ]
                    },
                    properties: {}
                };
            }
            return null;
        }).filter(feature => feature !== null)
    };

    return geoJson;
};
