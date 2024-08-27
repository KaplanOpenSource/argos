import { TreeRow } from "../App/TreeRow";
import { DeviceItem } from "./DeviceItem";
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { changeByName, createNewName } from "../Utils/utils";
import { AddMultipleDevices } from "./AddMultipleDevices";
import { AttributeTypesDialogButton } from "./AttributeTypesDialogButton";
import { SCOPE_EXPERIMENT } from "./AttributeType";
import { useContext } from "react";
import { experimentContext } from "../Context/ExperimentProvider";
import { assignUuids } from "../Context/TrackUuidUtils";
import { IconPicker } from "./IconPicker";
import { ButtonTooltip } from "../Utils/ButtonTooltip";
import { Visibility, VisibilityOff } from "@mui/icons-material";

export const DeviceType = ({ data, setData, experiment }) => {
    const { deleteDeviceType, hiddenDeviceTypes, setHiddenDeviceTypes } = useContext(experimentContext);

    const devicesEnclosingList = (data.devices || []).map(item => {
        return { deviceTypeName: data.name, deviceItemName: item.name, deviceType: data, deviceItem: item };
    });

    const isHidden = hiddenDeviceTypes.includes(data.name);

    const toggleHidden = () => {
        if (isHidden) {
            setHiddenDeviceTypes(hiddenDeviceTypes.filter(x => x !== data.name));
        } else {
            setHiddenDeviceTypes([...hiddenDeviceTypes, data.name]);
        }
    }

    console.log(hiddenDeviceTypes)

    return (
        <TreeRow
            data={data}
            setData={setData}
            components={
                <>
                    <IconPicker
                        data={data.icon || ""}
                        setData={val => setData({ ...data, icon: val })}
                    />
                    <ButtonTooltip
                        tooltip="Delete device type"
                        onClick={() => deleteDeviceType({ experimentName: experiment.name, deviceTypeName: data.name })}
                    >
                        <DeleteIcon />
                    </ButtonTooltip>
                    <ButtonTooltip
                        tooltip="Add new device"
                        onClick={e => {
                            e.stopPropagation();
                            const name = createNewName(data.devices, 'New Device');
                            setData({ ...data, devices: [...(data.devices || []), assignUuids({ name })] });
                        }}
                    >
                        <AddIcon />
                    </ButtonTooltip>
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
                    <ButtonTooltip
                        tooltip={isHidden ? "Show device type" : "Hide device type"}
                        onClick={toggleHidden}
                    >
                        {isHidden ? <VisibilityOff /> : <Visibility />}
                    </ButtonTooltip>
                </>
            }
        >
            {
                (data.devices || []).map(itemData => (
                    <DeviceItem
                        key={itemData.trackUuid || Math.random() + ""}
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
