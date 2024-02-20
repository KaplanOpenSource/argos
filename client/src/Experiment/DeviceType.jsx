import { TreeRow } from "../App/TreeRow";
import { DeviceItem } from "./DeviceItem";
import { TreeSublist } from "../App/TreeSublist";
import { AttributeType } from "./AttributeType";
import { IconButton } from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import { changeByName } from "../Utils/utils";

export const DeviceType = ({ data, setData }) => {
    return (
        <TreeRow
            key={data.name}
            data={data}
            setData={setData}
            components={
                <>
                    <IconButton
                        onClick={() => setData(undefined)}
                    >
                        <DeleteIcon />
                    </IconButton>
                </>
            }
        >
            <TreeSublist
                parentKey={data.name}
                data={data}
                fieldName='devices'
                nameTemplate='New Device'
                setData={setData}
            >
                {
                    (data.devices || []).map(itemData => (
                        <DeviceItem
                            key={itemData.name}
                            data={itemData}
                            setData={newData => {
                                setData({ ...data, devices: changeByName(data.devices, itemData.name, newData) });
                            }}
                            deviceType={data}
                        />
                    ))
                }
            </TreeSublist>

            <TreeSublist
                parentKey={data.name}
                data={data}
                fieldName='attributeTypes'
                nameTemplate='New Attribute Type'
                setData={setData}
                newDataCreator={() => {
                    return {
                        type: 'String',
                    }
                }}
            >
                {
                    (data.attributeTypes || []).map(itemData => (
                        <AttributeType
                            key={itemData.name}
                            data={itemData}
                            setData={newData => {
                                setData({ ...data, attributeTypes: changeByName(data.attributeTypes, itemData.name, newData) });
                            }}
                        />
                    ))
                }
            </TreeSublist>

        </TreeRow>
    )
}
