import { ImageMap } from './ImageMap';
import { ImagePlacementStretcher } from './ImagePlacementStretcher';

export const EmbeddedImageLayer = ({ experiment, setExperiment, shownMap, shownMapIndex, showImagePlacement }) => {
  return (<>
    <ImageMap
      experiment={experiment}
      image={shownMap}
      key={'embeddedmap_' + shownMapIndex} />
    {showImagePlacement && shownMap && shownMap.latnorth !== undefined
      ? <ImagePlacementStretcher
        imageData={shownMap}
        setImageData={v => {
          const exp = { ...experiment, imageEmbedded: [...experiment.imageEmbedded] };
          exp.imageEmbedded[shownMapIndex] = v;
          setExperiment(experiment.name, exp);
        }} />
      : null}
  </>);
};
