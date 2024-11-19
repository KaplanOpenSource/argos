import { Typography } from "@mui/material";
import { TreeSublist } from "../App/TreeSublist";
import { changeByName } from "../Utils/utils";
import { SCOPE_CONSTANT } from "./AttributeType";
import { DeviceType } from "./DeviceType";
import { sum } from "lodash";

export const DeviceTypesList = ({ data, setData }) => {
    const deviceTypes = data?.deviceTypes || [];
    const devicesNum = sum(deviceTypes.map(x => x?.devices?.length || 0));
    return (
        <TreeSublist
            parentKey={data.trackUuid}
            data={data}
            fieldName='deviceTypes'
            nameTemplate='New Device Type'
            setData={setData}
            newDataCreator={() => {
                return {
                    attributeTypes: [
                        {
                            "type": "Boolean",
                            "name": "StoreDataPerDevice",
                            "defaultValue": false,
                            "scope": SCOPE_CONSTANT
                        },
                    ]
                }
            }}
            textOnRow={devicesNum + ' Devices'}
        >
            {deviceTypes.map(itemData => (
                <DeviceType
                    key={itemData.trackUuid}
                    data={itemData}
                    setData={newData => {
                        setData({ ...data, deviceTypes: changeByName(data.deviceTypes, itemData.name, newData) });
                    }}
                    experiment={data}
                />
            ))}
        </TreeSublist>
    )
}