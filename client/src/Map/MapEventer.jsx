import { useMapEvents } from "react-leaflet";

export const MapEventer = ({ mapEvents, directlyOnMap = true }) => {
    const eventFuncs = {};
    for (const [funcName, func] of Object.entries(mapEvents)) {
        if (directlyOnMap) {
            eventFuncs[funcName] = (e) => {
                if (e.originalEvent.target === mapObj._container) {
                    func(e, mapObj);
                }
            }
        } else {
            eventFuncs[funcName] = (e) => {
                func(e, mapObj);
            }
        }
    }
    
    const mapObj = useMapEvents(eventFuncs);

    return null;
}