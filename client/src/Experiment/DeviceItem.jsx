import { IconButton } from "@mui/material";
import { TreeRow } from "../App/TreeRow";
import DeleteIcon from '@mui/icons-material/Delete';
import { AttributeItemList } from "./AttributeItemList";
import { SelectDeviceButton } from "./SelectDeviceButton";
import { useExperimentProvider } from "../Context/ExperimentProvider";
import { ScopeEnum } from "../types/types";
import { DeviceItemLocationButton } from "./DeviceItemLocationButton";
import { useCurrTrial } from "../Context/useCurrTrial";

export const DeviceItem = ({ data, setData, deviceType, showAttributes, devicesEnclosingList, scope, experiment }) => {
    const { currTrial, deleteDevice } = useExperimentProvider();

    const { trial } = useCurrTrial({});
    const device = trial.getDevice(deviceType.name, data.name);

    return (
        <TreeRow
            data={data}
            setData={setData}
            components={
                <>
                    <SelectDeviceButton
                        deviceItem={data}
                        deviceType={deviceType}
                        devicesEnclosingList={devicesEnclosingList}
                    />
                    {setData && experiment &&
                        <IconButton
                            size="small"
                            onClick={() => deleteDevice({ experimentName: experiment.name, deviceTypeName: deviceType.name, deviceItemName: data.name })}
                        >
                            <DeleteIcon />
                        </IconButton>
                    }
                    <DeviceItemLocationButton
                        deviceType={deviceType}
                        deviceItem={data}
                        // hasLocation={device.hasLocationOnMap(currTrial?.shownMapName || RealMapName)}
                        surroundingDevices={devicesEnclosingList}
                    />
                </>
            }
        >
            {currTrial.experiment && showAttributes &&
                <AttributeItemList
                    attributeTypes={deviceType.attributeTypes}
                    data={scope === ScopeEnum.SCOPE_TRIAL ? device.onTrial() : data}
                    setData={scope === ScopeEnum.SCOPE_TRIAL ? device.setOnTrial : setData}
                    scope={scope}
                    deviceItem={scope === ScopeEnum.SCOPE_TRIAL ? data : null}
                />
            }
        </TreeRow>
    )
}
