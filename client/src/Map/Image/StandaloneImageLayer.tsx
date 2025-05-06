import React from 'react';
import { IExperiment, IImageStandalone } from '../../types/types';
import { GridlinesLayer } from '../GridlinesLayer';
import { ImageMap } from './ImageMap';
import { ImagePlacementEditor } from './ImagePlacementEditor';

export const StandaloneImageLayer = ({
  experiment,
  setExperiment,
  shownMap,
  shownMapIndex,
  showImagePlacement,
}: {
  experiment: IExperiment | undefined,
  setExperiment: (name: string, exp: IExperiment) => void,
  shownMap: IImageStandalone,
  shownMapIndex: number,
  showImagePlacement: boolean,
}) => {
  return experiment
    ? (<>
      <ImageMap
        experiment={experiment}
        image={shownMap}
        key={'imagemap'}
      />
      {shownMap?.gridDelta
        ? (
          <GridlinesLayer
            from={[shownMap.ybottom, shownMap.xleft]}
            to={[shownMap.ytop, shownMap.xright]}
            delta={shownMap?.gridDelta}
            key={'grid'}
          />
        )
        : null}
      {showImagePlacement && shownMap && shownMap.xleft !== undefined
        ? <ImagePlacementEditor
          experiment={experiment}
          setExperiment={newExperimentData => setExperiment(experiment.name!, newExperimentData)}
          shownMapIndex={shownMapIndex}
          imageData={shownMap}
          key={'imagemapeditor'} />
        : null}
    </>)
    : null;
}