import { useEffect, useState } from "react";
import { TileLayer } from "react-leaflet";
import { useTokenStore } from "../Context/useTokenStore";

export const RealMap = ({ }) => {
  const { axiosSecure } = useTokenStore();
  const [tileServerInfo, setTileServerInfo] = useState();

  useEffect(() => {
    (async () => {
      try {
        const json = await axiosSecure().get("tileserver");
        if (!json?.data?.url) {
          throw "bad config json";
        }
        setTileServerInfo(json?.data);
      } catch (e) {
        alert(e);
      }
    })();
  }, []);

  return (
    <>
      {tileServerInfo
        ? (
          <TileLayer
            attribution={tileServerInfo.attribution || ""}
            url={tileServerInfo.url}

          // attribution='&copy; <a href="https://carto.com">Carto</a> contributors'
          // url='https://{s}.basemaps.cartocdn.com/rastertiles/voyager_labels_under/{z}/{x}/{y}.png'

          // attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          // url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"

          />)
        : null
      }
    </>
  )
}