import { Typography } from "@mui/material";
import { sum } from "lodash";
import { TreeSublist } from "../App/TreeSublist";
import { changeByName } from "../Utils/utils";
import { IExperiment, ScopeEnum } from "../types/types";
import { DeviceType } from "./DeviceType";

export const DeviceTypesList = ({
  data,
  setData,
}: {
  data: IExperiment,
  setData: (e: IExperiment) => void,
}) => {
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