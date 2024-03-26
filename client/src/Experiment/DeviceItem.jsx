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

export const DeviceItem = ({ data, setData, deviceType }) => {
    const { currTrial, setLocationsToDevices } = useContext(experimentContext);
    const devicesOnTrial = (currTrial.trial || {}).devicesOnTrial || [];
    const mapName = currTrial.shownMapName || RealMapName;
    const devicesOnTrialMap = devicesOnTrial.filter(d => d.location.name === mapName);
    const hasLocation = devicesOnTrialMap.find(d => d.deviceTypeName === deviceType.name && d.deviceItemName === data.name);
    return (
        <TreeRow
            key={data.name}
            data={data}
            setData={setData}
            components={
                <>
                    <SelectDeviceButton
                        deviceItem={data}
                        deviceType={deviceType}
                    />
                    <IconButton
                        size="small"
                        onClick={() => setData(undefined)}
                    >
                        <DeleteIcon />
                    </IconButton>
                    <ButtonTooltip
                        tooltip={hasLocation ? "Remove location" : "Has no location"}
                        onClick={() => setLocationsToDevices([{ deviceTypeName: deviceType.name, deviceItemName: data.name }], [undefined])}
                        disabled={!hasLocation}
                    >
                        {hasLocation ? <LocationOff /> : <LocationOffOutlined />}
                    </ButtonTooltip>
                </>
            }
        >
            <AttributeItemList
                attributeTypes={deviceType.attributeTypes}
                data={data}
                setData={setData}
            />
        </TreeRow>
    )
}
