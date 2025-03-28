import { CRS } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useContext } from 'react';

import { AttributionControl, MapContainer, ZoomControl } from 'react-leaflet';
import { experimentContext } from '../Context/ExperimentProvider';
import { RealMap } from './RealMap';
import { MapEventer } from './MapEventer';
import 'leaflet-contextmenu';
import 'leaflet-contextmenu/dist/leaflet.contextmenu.css';
import { DeviceIconLegend } from '../Icons/DeviceIconLegend';
import { StandaloneImageLayer } from './Image/StandaloneImageLayer';
import { EmbeddedImageLayer } from './Image/EmbeddedImageLayer';

L.Icon.Default.imagePath = 'leaflet-images/';

export const MapShower = ({ children }) => {
    const {
        currTrial,
        showImagePlacement,
        setExperiment
    } = useContext(experimentContext);

    const shownMap = ((currTrial.experiment || {}).imageStandalone || [])[currTrial.shownMapIndex];
    const embeddedMaps = (currTrial.experiment || {}).imageEmbedded || [];

    return (
        <MapContainer
            zoom={15}
            // style={{ height: "1000%" }}
            style={{
                // height: "100%", width: '100%',
                position: 'absolute', top: '5em', bottom: 0, right: 0, left: 0,
                zIndex: 0,
            }}
            crs={shownMap ? CRS.Simple : CRS.EPSG3857}
            // bounds={posbounds}
            center={[32.081128, 34.779729]}
            zoomControl={false}
            minZoom={-6}
            maxZoom={30}
            contextmenu={true}
            attributionControl={false}
        >
            <AttributionControl
                prefix={'Argos | <a href="https://leafletjs.com/">Leaflet</a>'}
            />
            <MapEventer directlyOnMap={false}
                mapEvents={{
                    layeradd: (_, mapObject) => mapObject.options.crs = shownMap ? CRS.Simple : CRS.EPSG3857
                }}
            />
            {shownMap
                ? <StandaloneImageLayer
                    experiment={currTrial.experiment}
                    setExperiment={setExperiment}
                    shownMap={shownMap}
                    shownMapIndex={currTrial.shownMapIndex}
                    showImagePlacement={showImagePlacement}
                    key={'standalone'}
                />
                : <>
                    <RealMap
                        key={'realmap'}
                    />
                    {embeddedMaps.map((embMap, i) => (
                        <EmbeddedImageLayer
                            experiment={currTrial.experiment}
                            setExperiment={setExperiment}
                            shownMap={embMap}
                            shownMapIndex={i}
                            showImagePlacement={showImagePlacement}
                            key={'embedded_' + i}
                        />
                    ))}
                </>
            }
            <ZoomControl position='bottomright' />
            <DeviceIconLegend />
            {children}
        </MapContainer>
    );
}