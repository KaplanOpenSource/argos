import "leaflet-draw";
import { useEffect, useRef } from "react";
import { Rectangle } from "react-leaflet";
import "../../lib/Edit.Rectangle";
import "../../lib/Edit.SimpleShape";

export const ImagePlacementStretcher = ({ imageData, setImageData }) => {
  const rectref = useRef();

  const { latnorth, latsouth, lngeast, lngwest } = imageData;

  useEffect(() => {
    rectref.current.editing.enable();
    rectref.current.on('edit', (e) => {
      const bounds = rectref.current._bounds;
      const newdata = {
        latnorth: bounds.getNorth(),
        latsouth: bounds.getSouth(),
        lngeast: bounds.getEast(),
        lngwest: bounds.getWest(),
      };
      const isChanged = Object.entries(newdata).find(([k, v]) => imageData[k] !== v);
      if (isChanged) {
        setImageData({ ...imageData, ...newdata });
      }
    })
    return () => rectref?.current?.off('edit');
  }, [])

  return (
    <>
      <Rectangle
        ref={rectref}
        bounds={[[latnorth, lngeast], [latsouth, lngwest]]}
        pathOptions={{ fill: false }}
      />
    </>
  )
}
