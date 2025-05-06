import type { Map } from 'leaflet';
import { useMapEvents } from "react-leaflet";

export const MapEventer = ({
  mapEvents,
  directlyOnMap = true,
}: {
  mapEvents: { [funcName: string]: (e: any, mapObj: Map) => any },
  directlyOnMap?: boolean,
}) => {
  const eventFuncs = {};
  for (const [funcName, func] of Object.entries(mapEvents)) {
    // if (directlyOnMap) {
    //   eventFuncs[funcName] = (e) => {
    //     console.log('_container: ', mapObj._container === mapObj.getContainer(), mapObj._container, mapObj.getContainer());
    //     if (e.originalEvent.target === mapObj.getContainer()) {
    //       func(e, mapObj);
    //     }
    //   }
    // } else {
    eventFuncs[funcName] = (e) => {
      func(e, mapObj);
    }
    // }
  }

  const mapObj = useMapEvents(eventFuncs);

  return null;
}