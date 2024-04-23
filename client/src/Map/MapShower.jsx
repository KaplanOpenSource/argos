import { CRS } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useContext } from 'react';

import { MapContainer, ZoomControl } from 'react-leaflet';
import { experimentContext } from '../Context/ExperimentProvider';
import { RealMap } from './RealMap';
import { ImageMap } from './ImageMap';
import { ImagePlacementEditor, ImagePlacementEditorLngLat } from './ImagePlacementEditor';
import { MapEventer } from './MapEventer';

L.Icon.Default.imagePath = 'leaflet-images/';

const StandaloneImageLayer = ({ experiment, setExperiment, shownMap, shownMapIndex, showImagePlacement }) => (<>
    <ImageMap
        experiment={experiment}
        image={shownMap}
        key={'imagemap'}
    />
    {showImagePlacement
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

const EmbeddedImageLayer = ({ experiment, setExperiment, shownMap, shownMapIndex, showImagePlacement }) => (<>
    <ImageMap
        experiment={experiment}
        image={shownMap}
        key={'embeddedmap_' + shownMapIndex}
    />
    {showImagePlacement
        ? <ImagePlacementEditorLngLat
            imageData={shownMap}
            setImageData={v => {
                const exp = { ...experiment, imageEmbedded: [...experiment.imageEmbedded] };
                exp.imageEmbedded[shownMapIndex] = v;
                setExperiment(experiment.name, exp);
            }}
            startDiagonal={true}
            key={'embeddedmapeditor_' + shownMapIndex}
        />
        : null}
</>)

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
                position: 'absolute', top: '5em', bottom: 0, right: 0, left: 0
            }}
            crs={shownMap ? CRS.Simple : CRS.EPSG3857}
            // bounds={posbounds}
            center={[32.081128, 34.779729]}
            zoomControl={false}
            minZoom={-6}
            maxZoom={30}
            contextmenu={true}
        >
            <MapEventer directlyOnMap={false}
                mapEvents={{
                    layeradd: (e, mo) => {mo.options.crs = shownMap ? CRS.Simple : CRS.EPSG3857; console.log(mo.options)}
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