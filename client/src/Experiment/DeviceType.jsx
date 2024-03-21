import { TreeRow } from "../App/TreeRow";
import { DeviceItem } from "./DeviceItem";
import { TreeSublist } from "../App/TreeSublist";
import { AttributeType } from "./AttributeType";
import { IconButton } from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { changeByName, createNewName } from "../Utils/utils";
import { AddMultipleDevices } from "./AddMultipleDevices";
import { AttributeTypesDialogButton } from "./AttributeTypesDialogButton";

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
                    <AttributeTypesDialogButton
                        data={data}
                        setData={setData}
                    />
                    <AddMultipleDevices
                        deviceType={data}
                        addDevices={newDevices => {
                            setData({ ...data, devices: [...(data.devices || []), ...newDevices] })
                        }}
                    />
                    <IconButton
                        onClick={e => {
                            e.stopPropagation();
                            const name = createNewName(data.devices, 'New Device');
                            setData({ ...data, devices: [...(data.devices || []), { name }] });
                        }}
                    >
                        <AddIcon />
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
        </TreeRow>
    )
}
