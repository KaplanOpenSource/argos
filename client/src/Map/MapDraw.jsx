import { useEffect, useRef, useState } from "react";
import { FeatureGroup, Polyline, useMap, useMapEvents } from "react-leaflet";
import 'leaflet-draw/dist/leaflet.draw.css';

export const MapDraw = ({ data, setData }) => {
    const ref = useRef(null);
    const map = useMap();

    const extractShapesData = (featureGroup) => {
        const shapes = [];

        featureGroup.eachLayer(layer => {
            if (layer instanceof L.Polygon) {
                shapes.push({
                    type: 'Polygon',
                    coordinates: layer.getLatLngs()[0].map(latlng => [latlng.lat, latlng.lng]),
                });
            } else if (layer instanceof L.Polyline) {
                shapes.push({
                    type: 'Polyline',
                    coordinates: layer.getLatLngs().map(latlng => [latlng.lat, latlng.lng]),
                });
            } else if (layer instanceof L.Circle) {
                shapes.push({
                    type: 'Circle',
                    center: [layer.getLatLng().lat, layer.getLatLng().lng],
                    radius: layer.getRadius(),
                });
            }
        });

        return shapes;
    };

    const setFeatureGroupWithShapes = (featureGroup, shapesData) => {
        // Clear existing layers
        featureGroup.clearLayers();

        // Iterate over shapesData to recreate layers
        shapesData.forEach(shape => {
            let layer;
            if (shape.type === 'Polygon') {
                layer = L.polygon(shape.coordinates.map(coord => [coord[0], coord[1]]));
            } else if (shape.type === 'Polyline') {
                layer = L.polyline(shape.coordinates.map(coord => [coord[0], coord[1]]));
            } else if (shape.type === 'Circle') {
                if (shape?.center?.length === 2 && shape?.radius) {
                    layer = L.circle([shape.center[0], shape.center[1]], { radius: shape.radius });
                }
            }

            if (layer) {
                layer.addTo(featureGroup);
            }
        });
    };

    useEffect(() => {
        setFeatureGroupWithShapes(ref.current, data);
    }, [data]);

    useEffect(() => {
        if (!map || !ref.current) return;

        // Initialize the Leaflet Draw control and pass the FeatureGroup
        const drawControl = new L.Control.Draw({
            position: 'bottomright',
            edit: {
                featureGroup: ref.current,
            },
            draw: {
                polygon: true,
                polyline: true,
                rectangle: false,
                circle: true,
                marker: false,
                circlemarker: false,
            },
        });

        map.addControl(drawControl);

        // Handle the creation of new layers
        map.on(L.Draw.Event.CREATED, (event) => {
            const { layer } = event;
            ref.current.addLayer(layer);
            setData(extractShapesData(ref.current));
        });

        // Handle the editing of layers
        map.on(L.Draw.Event.EDITED, (event) => {
            const { layers } = event;
            layers.eachLayer((layer) => {
                ref.current.addLayer(layer);
            });
            setData(extractShapesData(ref.current));
        });

        // Handle the deletion of layers
        map.on(L.Draw.Event.DELETED, (event) => {
            const { layers } = event;
            layers.eachLayer((layer) => {
                ref.current.removeLayer(layer);
            });
            setData(extractShapesData(ref.current));
        });

        return () => {
            map.removeControl(drawControl);
            map.off(L.Draw.Event.CREATED);
            map.off(L.Draw.Event.EDITED);
            map.off(L.Draw.Event.DELETED);
        };
    }, [map]);

    return (
        <FeatureGroup
            ref={ref}
        >
            {/* Add your layers here if needed */}
        </FeatureGroup>
    );
}

