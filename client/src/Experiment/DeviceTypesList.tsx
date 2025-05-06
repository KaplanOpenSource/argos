import { Typography } from "@mui/material";
import { TreeSublist } from "../App/TreeSublist";
import { changeByName } from "../Utils/utils";
import { ScopeEnum } from "../types/types";
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
            nameTemplate='Device Type'
            setData={setData}
            newDataCreator={() => {
                return {
                    attributeTypes: [
                        {
                            "type": "Boolean",
                            "name": "StoreDataPerDevice",
                            "defaultValue": false,
                            "scope": ScopeEnum.SCOPE_CONSTANT
                        },
                    ]
                }
            }}
            components={<>
                <Typography>{devicesNum} Devices</Typography>
            </>}
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