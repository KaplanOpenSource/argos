import React from 'react';
import { IExperiment, IImageEmbedded } from '../../types/types';
import { GridlinesLayer } from '../GridlinesLayer';
import { ImageMap } from './ImageMap';
import { ImagePlacementStretcher } from './ImagePlacementStretcher';

export const EmbeddedImageLayer = ({
  experiment,
  setExperiment,
  shownMap,
  showImagePlacement,
}: {
  experiment: IExperiment | undefined,
  setExperiment: (name: string, exp: IExperiment) => void,
  shownMap: IImageEmbedded,
  showImagePlacement: boolean,
}) => {
  return shownMap?.name && experiment?.name
    ? (<>
      <ImageMap
        experiment={experiment}
        image={shownMap}
        key={'embeddedmap_' + shownMap.name}
      />
      {shownMap?.gridDelta
        ? (
          <GridlinesLayer
            from={[shownMap.latsouth, shownMap.lngwest]}
            to={[shownMap.latnorth, shownMap.lngeast]}
            delta={shownMap?.gridDelta}
            key={'grid'}
          />
        )
        : null}
      {showImagePlacement && shownMap && shownMap.latnorth !== undefined
        ? <ImagePlacementStretcher
          imageData={shownMap}
          setImageData={newData => {
            const exp = structuredClone(experiment);
            exp.imageEmbedded = (exp.imageEmbedded || []).map(x => x.name === shownMap.name ? newData : x);
            setExperiment(experiment!.name!, exp);
          }} />
        : null}
    </>)
    : null;
};
