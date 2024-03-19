import { CRS } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useContext } from 'react';

import { MapContainer, ZoomControl } from 'react-leaflet';
import { experimentContext } from '../Context/ExperimentProvider';
import { RealMap } from './RealMap';
import { ImageMap } from './ImageMap';
import { ImagePlacementEditor } from './ImagePlacementEditor';

L.Icon.Default.imagePath = 'leaflet-images/';

export const MapShower = ({ children }) => {
    const { currTrial, showImagePlacement } = useContext(experimentContext);
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
            {shownMap
                ? <>
                    <ImageMap
                        experiment={currTrial.experiment}
                        image={shownMap}
                    />
                    {showImagePlacement
                        ? <ImagePlacementEditor
                            experiment={currTrial.experiment}
                            image={shownMap}
                        />
                        : null}
                </>
                : <RealMap
                />
            }
            <ZoomControl position='bottomright' />
            {children}
        </MapContainer>
    );
}