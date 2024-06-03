import { DomEvent, LatLngBounds } from "leaflet";
import { useMapEvents } from "react-leaflet";

export const AreaMarkListener = ({ onAreaMarked }) => {
    const mapObj = useMapEvents({
        boxzoomend: (e) => {
            DomEvent.stop(e);
            onAreaMarked(e);
        },
    });

    if (mapObj.boxZoom) {
        mapObj.boxZoom._onMouseUp = function (e) {
            if (e.which === 1 || e.button === 1) {
                this._finish();
                if (this._moved) {
                    this._clearDeferredResetState();
                    this._resetStateTimeout = setTimeout(this._resetState.bind(this), 0);
                    var boxZoomBounds = new LatLngBounds(
                        this._map.containerPointToLatLng(this._startPoint),
                        this._map.containerPointToLatLng(this._point)
                    );
                    this._map.fire('boxzoomend', { boxZoomBounds });
                }
            }
        };
    }

    return null;
};