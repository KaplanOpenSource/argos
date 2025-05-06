import React from 'react';
import { IExperiment, IImageEmbedded } from '../../types/types';
import { GridlinesLayer } from '../GridlinesLayer';
import { ImageMap } from './ImageMap';
import { ImagePlacementStretcher } from './ImagePlacementStretcher';

export const EmbeddedImageLayer = ({
  experiment,
  setExperiment,
  shownMap,
  shownMapIndex,
  showImagePlacement,
}: {
  experiment: IExperiment | undefined,
  setExperiment: (name: string, exp: IExperiment) => void,
  shownMap: IImageEmbedded,
  shownMapIndex: number,
  showImagePlacement: boolean,
}) => {
  return (<>
    <ImageMap
      experiment={experiment}
      image={shownMap}
      key={'embeddedmap_' + shownMapIndex}
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
        setImageData={v => {
          const exp = { ...experiment, imageEmbedded: [...experiment?.imageEmbedded || []] };
          exp.imageEmbedded[shownMapIndex] = v;
          setExperiment(experiment!.name!, exp);
        }} />
      : null}
  </>);
};
