import { IconButton } from "@mui/material";
import { TreeRow } from "../App/TreeRow";
import DeleteIcon from '@mui/icons-material/Delete';
import { AttributeItemList } from "./AttributeItemList";
import { SelectDeviceButton } from "./SelectDeviceButton";
import { ButtonTooltip } from "../Utils/ButtonTooltip";
import { RealMapName } from "../constants/constants";
import { LocationOff, LocationOffOutlined } from "@mui/icons-material";
import { useContext } from "react";
import { experimentContext } from "../Context/ExperimentProvider";
import { SCOPE_TRIAL } from "./AttributeType";

export const DeviceItem = ({ data, setData, deviceType, showAttributes, withDescription, devicesEnclosingList, scope }) => {
    const { currTrial, setLocationsToDevices, setTrialData } = useContext(experimentContext);
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

    const deleteDevice = () => {
        setData(undefined);
    }

    return (
        <TreeRow
            key={data.name}
            data={data}
            setData={setData}
            withDescription={withDescription}
            components={
                <>
                    <SelectDeviceButton
                        deviceItem={data}
                        deviceType={deviceType}
                        devicesEnclosingList={devicesEnclosingList}
                    />
                    {setData &&
                        <IconButton
                            size="small"
                            onClick={deleteDevice}
                        >
                            <DeleteIcon />
                        </IconButton>
                    }
                    {currTrial.trial &&
                        <ButtonTooltip
                            tooltip={hasLocation ? "Remove location" : "Has no location"}
                            onClick={() => setLocationsToDevices([{ deviceTypeName: deviceType.name, deviceItemName: data.name }], [undefined])}
                            disabled={!hasLocation}
                        >
                            {hasLocation ? <LocationOff /> : <LocationOffOutlined />}
                        </ButtonTooltip>
                    }
                </>
            }
        >
            {currTrial.trial && showAttributes &&
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
