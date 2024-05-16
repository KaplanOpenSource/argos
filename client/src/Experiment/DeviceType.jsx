import { TreeRow } from "../App/TreeRow";
import { DeviceItem } from "./DeviceItem";
import { IconButton, Tooltip } from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { changeByName, createNewName } from "../Utils/utils";
import { AddMultipleDevices } from "./AddMultipleDevices";
import { AttributeTypesDialogButton } from "./AttributeTypesDialogButton";
import { SCOPE_EXPERIMENT } from "./AttributeType";
import { useContext } from "react";
import { experimentContext } from "../Context/ExperimentProvider";

export const DeviceType = ({ data, setData, experiment }) => {
    const { deleteDeviceType } = useContext(experimentContext);

    const devicesEnclosingList = (data.devices || []).map(item => {
        return { deviceTypeName: data.name, deviceItemName: item.name };
    });

    return (
        <TreeRow
            data={data}
            setData={setData}
            components={
                <>
                    <Tooltip title="Delete device type" placement="top">
                        <IconButton
                            size="small"
                            onClick={() => deleteDeviceType({ experimentName: experiment.name, deviceTypeName: data.name })}
                        >
                            <DeleteIcon />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Add new device" placement="top">
                        <IconButton
                            size="small"
                            onClick={e => {
                                e.stopPropagation();
                                const name = createNewName(data.devices, 'New Device');
                                setData({ ...data, devices: [...(data.devices || []), { name }] });
                            }}
                        >
                            <AddIcon />
                        </IconButton>
                    </Tooltip>
                    <AddMultipleDevices
                        deviceType={data}
                        addDevices={newDevices => {
                            setData({ ...data, devices: [...(data.devices || []), ...newDevices] })
                        }}
                    />
                    <AttributeTypesDialogButton
                        data={data}
                        setData={setData}
                        isOfDevice={true}
                    />
                </>
            }
        >
            {
                (data.devices || []).map(itemData => (
                    <DeviceItem
                        key={itemData.trackUuid}
                        data={itemData}
                        setData={newData => {
                            setData({ ...data, devices: changeByName(data.devices, itemData.name, newData) });
                        }}
                        deviceType={data}
                        showAttributes={true}
                        scope={SCOPE_EXPERIMENT}
                        devicesEnclosingList={devicesEnclosingList}
                        experiment={experiment}
                    />
                ))
            }
        </TreeRow>
    )
}
