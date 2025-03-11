import { ImageMap } from './ImageMap';
import { ImagePlacementEditor } from './ImagePlacementEditor';

export const StandaloneImageLayer = ({ experiment, setExperiment, shownMap, shownMapIndex, showImagePlacement }) => (<>
  <ImageMap
    experiment={experiment}
    image={shownMap}
    key={'imagemap'} />
  {showImagePlacement && shownMap && shownMap.xleft !== undefined
    ? <ImagePlacementEditor
      experiment={experiment}
      setExperiment={newExperimentData => setExperiment(experiment.name, newExperimentData)}
      shownMapIndex={shownMapIndex}
      imageData={shownMap}
      key={'imagemapeditor'} />
    : null}
</>);
