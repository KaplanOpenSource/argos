import { CRS } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useContext } from 'react';

import { MapContainer, ZoomControl } from 'react-leaflet';
import { experimentContext } from '../Context/ExperimentProvider';
import { RealMap } from './RealMap';
import { ImageMap } from './ImageMap';
import { ImagePlacementEditor } from './ImagePlacementEditor';
import { MapEventer } from './MapEventer';
import { ImagePlacementStretcher } from './ImagePlacementStretcher';
import 'leaflet-contextmenu';
import 'leaflet-contextmenu/dist/leaflet.contextmenu.css';
import { MapDraw } from './MapDraw';

L.Icon.Default.imagePath = 'leaflet-images/';

const StandaloneImageLayer = ({ experiment, setExperiment, shownMap, shownMapIndex, showImagePlacement }) => (<>
    <ImageMap
        experiment={experiment}
        image={shownMap}
        key={'imagemap'}
    />
    {showImagePlacement && shownMap && shownMap.xleft !== undefined
        ? <ImagePlacementEditor
            imageData={shownMap}
            setImageData={v => {
                const exp = { ...experiment, imageStandalone: [...experiment.imageStandalone] };
                exp.imageStandalone[shownMapIndex] = v;
                setExperiment(experiment.name, exp);
            }}
            key={'imagemapeditor'}
        />
        : null}
</>)

const EmbeddedImageLayer = ({ experiment, setExperiment, shownMap, shownMapIndex, showImagePlacement }) => {
    return (<>
        <ImageMap
            experiment={experiment}
            image={shownMap}
            key={'embeddedmap_' + shownMapIndex}
        />
        {showImagePlacement && shownMap && shownMap.latnorth !== undefined
            ? <ImagePlacementStretcher
                imageData={shownMap}
                setImageData={v => {
                    const exp = { ...experiment, imageEmbedded: [...experiment.imageEmbedded] };
                    exp.imageEmbedded[shownMapIndex] = v;
                    setExperiment(experiment.name, exp);
                }}
            />
            : null}
    </>)
}

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
        >
            <MapDraw />
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
            {children}
        </MapContainer>
    );
}