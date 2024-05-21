import { LocationOff, LocationOffOutlined } from "@mui/icons-material"
import { ButtonTooltip } from "../Utils/ButtonTooltip"
import { useContext } from "react";
import { experimentContext } from "../Context/ExperimentProvider";
import { RealMapName } from "../constants/constants";

export const DeviceItemLocationButton = ({ deviceType, deviceItem, hasLocation }) => {
    const { currTrial, setLocationsToDevices } = useContext(experimentContext);
    let hasLocationCalced = hasLocation;
    if (hasLocation === undefined) {
        const devicesOnTrial = (currTrial.trial || {}).devicesOnTrial || [];
        const mapName = currTrial.shownMapName || RealMapName;
        const index = devicesOnTrial.findIndex(d => d.location.name === mapName && d.deviceTypeName === deviceType.name && d.deviceItemName === deviceItem.name);
        const deviceTrial = devicesOnTrial[index];
        hasLocationCalced = deviceTrial && deviceTrial.location && deviceTrial.location.coordinates;
    }

    return (
        <>
            {currTrial.trial &&
                <ButtonTooltip
                    tooltip={hasLocationCalced ? "Remove location" : "Has no location"}
                    onClick={() => setLocationsToDevices([{ deviceTypeName: deviceType.name, deviceItemName: deviceItem.name }], [undefined])}
                    disabled={!hasLocationCalced}
                >
                    {hasLocationCalced ? <LocationOff /> : <LocationOffOutlined />}
                </ButtonTooltip>
            }
        </>
    )
}