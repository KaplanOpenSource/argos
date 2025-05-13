import { LatLngBounds, Map } from "leaflet";
import { createContext, useContext, useEffect, useState } from "react";
import { useMap } from "react-leaflet";
import { MapEventer } from "./MapEventer";

type IActionOnMap = (mapObj: Map) => void;
type IActionsOnMapStore = {
  actionsOnMap: IActionOnMap[],
  setActionsOnMap: (newData: IActionOnMap[]) => void,
  addActionOnMap: (newAction: IActionOnMap) => void,
  mapBounds: LatLngBounds | undefined,
  setMapBounds: (newData: LatLngBounds | undefined) => void,
}

export const ActionsOnMapContext = createContext<IActionsOnMapStore | null>(null);

export const ActionsOnMapProvider = ({ children }) => {
  const [actionsOnMap, setActionsOnMap] = useState<IActionOnMap[]>([]);
  const [mapBounds, setMapBounds] = useState<LatLngBounds>();
  const addActionOnMap = (newAction: IActionOnMap) => {
    setActionsOnMap([...actionsOnMap, newAction])
  }

  return (
    <ActionsOnMapContext.Provider value={{
      actionsOnMap,
      setActionsOnMap,
      addActionOnMap,
      mapBounds,
      setMapBounds,
    }}>
      {children}
    </ActionsOnMapContext.Provider>
  )
}

export const ActionsOnMapDoer = ({ }) => {
  const { actionsOnMap, setActionsOnMap, setMapBounds } = useContext(ActionsOnMapContext)!;
  const mapObject = useMap();
  useEffect(() => {
    if (mapObject && actionsOnMap.length > 0) {
      const act = actionsOnMap[0];
      setActionsOnMap(actionsOnMap.slice(1));
      act(mapObject);
    }
  }, [mapObject, actionsOnMap]);

  useEffect(() => {
    setMapBounds(mapObject.getBounds());
  }, [mapObject]);

  return (
    <MapEventer
      directlyOnMap={false}
      mapEvents={{
        moveend: (_e: any, mapObj: Map) => {
          setMapBounds(mapObj.getBounds());
        },
        load: (_e: any, mapObj: Map) => {
          setMapBounds(mapObj.getBounds());
        },
      }}
    />
  );
}

