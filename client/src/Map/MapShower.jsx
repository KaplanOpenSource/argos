import { CRS } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useContext } from 'react';

import { ImageOverlay, MapContainer, TileLayer, ZoomControl } from 'react-leaflet';
import { experimentContext } from '../Context/ExperimentProvider';
import { baseUrl } from '../Context/FetchExperiment';
import { WholeMapContextSetter } from './WholeMapContext';

L.Icon.Default.imagePath = 'leaflet-images/';

export const MapShower = ({ children }) => {
    const { currTrial } = useContext(experimentContext);
    const shownMap = ((currTrial.experiment || {}).imageStandalone || [])[currTrial.shownMapIndex];
    return (
        <MapContainer
            zoom={15}
            // style={{ height: "1000%" }}
            style={{
                // height: "100%", width: '100%',
                position: 'absolute', top: '5em', bottom: 0, right: 0, left: 0
            }}
            crs={CRS.EPSG3857}
            // bounds={posbounds}
            center={[32.081128, 34.779729]}
            zoomControl={false}
            minZoom={-6}
            maxZoom={30}
            contextmenu={true}
        >
            <WholeMapContextSetter />
            {shownMap
                ? <ImageOverlay
                    url={baseUrl + shownMap.path}
                    bounds={[[shownMap.ytop, shownMap.xleft], [shownMap.ybottom, shownMap.xright]]}
                />
                : <TileLayer
                    attribution='&copy; <a href="https://carto.com">Carto</a> contributors'
                    url='https://{s}.basemaps.cartocdn.com/rastertiles/voyager_labels_under/{z}/{x}/{y}.png'
                // attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                // url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />}
            <ZoomControl position='bottomright' />
            {children}
        </MapContainer>
    );
}