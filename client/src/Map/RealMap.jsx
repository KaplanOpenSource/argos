import { useEffect, useState } from "react"
import { TileLayer } from "react-leaflet"

export const RealMap = ({ }) => {
    const [tileServerInfo, setTileServerInfo] = useState();

    useEffect(() => {
        (async () => {
            try {
                const resp = await fetch("/config.json");
                if (resp.ok) {
                    const com = await resp.json();
                    if (!com || !com.tileserver || !com.tileserver.url) {
                        throw "bad config json";
                    }
                    setTileServerInfo(com.tileserver);
                } else {
                    throw "no config json";
                }
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