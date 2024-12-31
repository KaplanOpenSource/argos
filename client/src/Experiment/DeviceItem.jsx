import { IconButton } from "@mui/material";
import { TreeRow } from "../App/TreeRow";
import DeleteIcon from '@mui/icons-material/Delete';
import { AttributeItemList } from "./AttributeItemList";
import { SelectDeviceButton } from "./SelectDeviceButton";
import { RealMapName } from "../constants/constants";
import { useContext } from "react";
import { experimentContext } from "../Context/ExperimentProvider";
import { SCOPE_TRIAL } from "./AttributeType";
import { DeviceItemLocationButton } from "./DeviceItemLocationButton";
import { useDevice } from "../Context/useDevice";

export const DeviceItem = ({ data, setData, deviceType, showAttributes, devicesEnclosingList, scope, experiment }) => {
    const { currTrial, deleteDevice } = useContext(experimentContext);

    const { device } = useDevice({ deviceTypeName: deviceType.name, deviceItemName: data.name })
    const mapName = currTrial.shownMapName || RealMapName;

    return !device.deviceOnTrial() ? null : (
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
                        hasLocation={device.hasLocation(mapName)}
                        surroundingDevices={devicesEnclosingList}
                    />
                </>
            }
        >
            {currTrial.experiment && showAttributes &&
                <AttributeItemList
                    attributeTypes={deviceType.attributeTypes}
                    data={scope === SCOPE_TRIAL ? device.deviceOnTrial() : data}
                    setData={scope === SCOPE_TRIAL ? device.setDeviceOnTrial : setData}
                    scope={scope}
                    deviceItem={scope === SCOPE_TRIAL ? data : null}
                />
            }
        </TreeRow>
    )
}
