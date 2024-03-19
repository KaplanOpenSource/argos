import { TileLayer } from "react-leaflet"

export const RealMap = ({ }) => {
    return (
        <TileLayer
            attribution='&copy; <a href="https://carto.com">Carto</a> contributors'
            url='https://{s}.basemaps.cartocdn.com/rastertiles/voyager_labels_under/{z}/{x}/{y}.png'
        // attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        // url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
    )
}