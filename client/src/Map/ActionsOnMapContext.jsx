import { createContext, useContext, useEffect, useState } from "react";
import { useMap } from "react-leaflet";

export const ActionsOnMapContext = createContext();

export const ActionsOnMapProvider = ({ children }) => {
    const [actionsOnMap, setActionsOnMap] = useState([]);
    const addActionOnMap = (newAction) => {
        setActionsOnMap([...actionsOnMap, newAction])
    }

    return (
        <ActionsOnMapContext.Provider value={{
            actionsOnMap,
            setActionsOnMap,
            addActionOnMap
        }}>
            {children}
        </ActionsOnMapContext.Provider>
    )
}

export const ActionsOnMapDoer = ({ }) => {
    const { actionsOnMap, setActionsOnMap } = useContext(ActionsOnMapContext);
    const mapObject = useMap();
    useEffect(() => {
        if (mapObject && actionsOnMap.length > 0) {
            const act = actionsOnMap[0];
            setActionsOnMap(actionsOnMap.slice(1));
            act(mapObject);
        }
    }, [mapObject, actionsOnMap]);
    return null;
}

