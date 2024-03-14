import { createContext, useContext, useState } from "react";
import { useMap } from "react-leaflet";

const WholeMapContext = createContext();

export const useWholeMap = () => {
    return useContext(WholeMapContext);
}

export const WholeMapProvider = ({ children }) => {
    const [mapObject, setMapObject] = useState();
    return (
        <WholeMapContext.Provider value={{ mapObject, setMapObject }}>
            {children}
        </WholeMapContext.Provider>
    )
}

export const WholeMapContextSetter = () => {
    const mapObj = useMap();
    const { mapObject, setMapObject } = useContext(WholeMapContext);
    if (mapObj !== mapObject) {
        setMapObject(mapObj);
    }
    return null;
}
