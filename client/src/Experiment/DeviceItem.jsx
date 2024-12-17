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

export const DeviceItem = ({ data, setData, deviceType, showAttributes, devicesEnclosingList, scope, experiment }) => {
    const { currTrial, setTrialData, deleteDevice } = useContext(experimentContext);
    const devicesOnTrial = (currTrial.trial || {}).devicesOnTrial || [];
    const mapName = currTrial.shownMapName || RealMapName;
    const index = devicesOnTrial.findIndex(d => d.location.name === mapName && d.deviceTypeName === deviceType.name && d.deviceItemName === data.name);
    const deviceTrial = devicesOnTrial[index];
    const hasLocation = deviceTrial && deviceTrial.location && deviceTrial.location.coordinates;

    const setAttrListOnTrial = newDeviceData => {
        const data = { ...currTrial.trial, devicesOnTrial: devicesOnTrial.slice() };
        data.devicesOnTrial[index] = newDeviceData;
        setTrialData(data);
    };

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
                        hasLocation={hasLocation}
                        surroundingDevices={devicesEnclosingList}
                    />
                </>
            }
        >
            {currTrial.experiment && showAttributes &&
                <AttributeItemList
                    attributeTypes={deviceType.attributeTypes}
                    data={scope === SCOPE_TRIAL ? deviceTrial : data}
                    setData={scope === SCOPE_TRIAL ? setAttrListOnTrial : setData}
                    scope={scope}
                    deviceItem={scope === SCOPE_TRIAL ? data : null}
                />
            }
        </TreeRow>
    )
}
