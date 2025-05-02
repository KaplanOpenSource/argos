import { createContext, useContext, useEffect, useState } from "react";
import { useMap } from "react-leaflet";
import { MapEventer } from "./MapEventer";

export const ActionsOnMapContext = createContext();

export const ActionsOnMapProvider = ({ children }) => {
    const [actionsOnMap, setActionsOnMap] = useState([]);
    const [mapBounds, setMapBounds] = useState();
    const addActionOnMap = (newAction) => {
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
    const { actionsOnMap, setActionsOnMap, setMapBounds } = useContext(ActionsOnMapContext);
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
                moveend: (e, mapObj) => {
                    setMapBounds(mapObj.getBounds());
                },
                load: (e, mapObj) => {
                    setMapBounds(mapObj.getBounds());
                },
            }}
        />
    );
}

