import { useEffect, useRef, useState } from "react";
import { FeatureGroup, Polyline, useMap, useMapEvents } from "react-leaflet";
import 'leaflet-draw/dist/leaflet.draw.css';

export const MapDraw = ({ }) => {
    const featureGroupRef = useRef(null);
    const map = useMap();

    useEffect(() => {
        if (!map || !featureGroupRef.current) return;

        // Initialize the Leaflet Draw control and pass the FeatureGroup
        const drawControl = new L.Control.Draw({
            position: 'bottomright',
            edit: {
                featureGroup: featureGroupRef.current,
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
            featureGroupRef.current.addLayer(layer);
        });

        // Handle the editing of layers
        map.on(L.Draw.Event.EDITED, (event) => {
            const { layers } = event;
            layers.eachLayer((layer) => {
                featureGroupRef.current.addLayer(layer);
            });
        });

        // Handle the deletion of layers
        map.on(L.Draw.Event.DELETED, (event) => {
            const { layers } = event;
            layers.eachLayer((layer) => {
                featureGroupRef.current.removeLayer(layer);
            });
        });

        return () => {
            map.removeControl(drawControl);
        };
    }, [map]);

    return (
        <FeatureGroup ref={featureGroupRef}>
            {/* Add your layers here if needed */}
        </FeatureGroup>
    );
}

