import { useEffect } from "react";
import { useMapEvents } from "react-leaflet";
import { parseUrlParams, replaceUrlParams } from "../Utils/utils";

export const MapPositionOnUrl = ({ }) => {
  const mapObj = useMapEvents({
    move: () => {
      replaceUrlParams({
        lat: mapObj.getCenter().lat,
        lng: mapObj.getCenter().lng,
        z: mapObj.getZoom(),
      });
    },
  });

  useEffect(() => {
    const { lat, lng, z } = parseUrlParams();
    if (isFinite(lat) && isFinite(lng) && isFinite(z)) {
      mapObj.setView([lat, lng], z);
    }
  }, []);

  return (
    <>
    </>
  )
}