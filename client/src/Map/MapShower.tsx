import L, { CRS } from 'leaflet';
import 'leaflet/dist/leaflet.css';

import 'leaflet-contextmenu';
import 'leaflet-contextmenu/dist/leaflet.contextmenu.css';
import { AttributionControl, MapContainer, ZoomControl } from 'react-leaflet';
import { useExperimentProvider } from '../Context/ExperimentProvider';
import { useChosenTrial } from '../Context/useChosenTrial';
import { useExperiments } from '../Context/useExperiments';
import { useShowImagePlacement } from '../Context/useShowImagePlacement';
import { DeviceIconLegend } from '../Icons/DeviceIconLegend';
import { EmbeddedImageLayer } from './Image/EmbeddedImageLayer';
import { StandaloneImageLayer } from './Image/StandaloneImageLayer';
import { MapEventer } from './MapEventer';
import { RealMap } from './RealMap';

L.Icon.Default.imagePath = 'leaflet-images/';

export const MapShower = ({ children }) => {
  const {
    currTrial,
  } = useExperimentProvider();
  const { showImagePlacement } = useShowImagePlacement();
  const { setExperiment } = useExperiments();
  const { shownMap } = useChosenTrial();

  const embeddedMaps = (currTrial.experiment || {}).imageEmbedded || [];

  return (
    <MapContainer
      zoom={15}
      style={{
        position: 'absolute',
        top: '5em',
        bottom: 0,
        right: 0,
        left: 0,
        zIndex: 0,
      }}
      crs={shownMap() ? CRS.Simple : CRS.EPSG3857}
      center={[32.081128, 34.779729]}
      zoomControl={false}
      minZoom={-6}
      maxZoom={30}
      attributionControl={false}
    >
      <AttributionControl
        prefix={'Argos | <a href="https://leafletjs.com/">Leaflet</a>'}
      />
      <MapEventer directlyOnMap={false}
        mapEvents={{
          layeradd: (_, mapObject) => mapObject.options.crs = shownMap() ? CRS.Simple : CRS.EPSG3857
        }}
      />
      {shownMap()
        ? (
          <StandaloneImageLayer
            experiment={currTrial.experiment}
            setExperiment={setExperiment}
            shownMap={shownMap()!}
            showImagePlacement={showImagePlacement}
            key={'standalone'}
          />
        ) : (
          <>
            <RealMap
              key={'realmap'}
            />
            {embeddedMaps.map((embMap, i) => (
              <EmbeddedImageLayer
                experiment={currTrial.experiment}
                setExperiment={setExperiment}
                shownMap={embMap}
                showImagePlacement={showImagePlacement}
                key={'embedded_' + i}
              />
            ))}
          </>
        )
      }
      <ZoomControl position='bottomright' />
      <DeviceIconLegend />
      {children}
    </MapContainer>
  );
}