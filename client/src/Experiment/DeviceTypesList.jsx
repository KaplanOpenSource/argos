import { changeByName } from "../Utils/utils";
import { DeviceType } from "./DeviceType";

export const DeviceTypesList = ({ data, setData }) => {
    return (data.deviceTypes || []).map(itemData => (
        <DeviceType
            key={itemData.name}
            data={itemData}
            setData={newData => {
                setData({ ...data, deviceTypes: changeByName(data.deviceTypes, itemData.name, newData) });
            }}
            experiment={data}
        />
    ))
}