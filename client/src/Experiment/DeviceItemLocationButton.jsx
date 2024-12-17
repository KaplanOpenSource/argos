import { LocationOff, LocationOffOutlined } from "@mui/icons-material"
import { ButtonTooltip } from "../Utils/ButtonTooltip"
import { useContext } from "react";
import { experimentContext } from "../Context/ExperimentProvider";
import { RealMapName } from "../constants/constants";
import { ContextMenu } from "../Utils/ContextMenu";

export const DeviceItemLocationButton = ({ deviceType, deviceItem, hasLocation, surroundingDevices, }) => {
    const { currTrial, setLocationsToDevices } = useContext(experimentContext);
    let hasLocationCalced = hasLocation;
    if (hasLocation === undefined) {
        const devicesOnTrial = (currTrial.trial || {}).devicesOnTrial || [];
        const mapName = currTrial.shownMapName || RealMapName;
        const index = devicesOnTrial.findIndex(d => d.location.name === mapName && d.deviceTypeName === deviceType.name && d.deviceItemName === deviceItem.name);
        const deviceTrial = devicesOnTrial[index];
        hasLocationCalced = deviceTrial && deviceTrial.location && deviceTrial.location.coordinates;
    }

    const removeLocation = () => {
        setLocationsToDevices([{ deviceTypeName: deviceType.name, deviceItemName: deviceItem.name }], [undefined]);
    }

    const menuItems = [
        { label: 'Remove location', callback: removeLocation },
    ];

    if (surroundingDevices) {
        menuItems.push({
            label: 'Remove locations to all devices in list', callback: () => {
                const devicesToRemove = surroundingDevices.map(d => {
                    return { deviceTypeName: d.deviceType.name, deviceItemName: d.deviceItem.name };
                });
                const locationsEmpty = devicesToRemove.map(() => undefined);
                setLocationsToDevices(devicesToRemove, locationsEmpty);
            }
        })
    }

    return (
        <>
            {currTrial.trial && (
                <ContextMenu menuItems={menuItems}>
                    <ButtonTooltip
                        tooltip={hasLocationCalced ? "Remove location" : "Has no location"}
                        onClick={removeLocation}
                        disabled={!hasLocationCalced}
                    >
                        {hasLocationCalced ? <LocationOff /> : <LocationOffOutlined />}
                    </ButtonTooltip>
                </ContextMenu>
            )}
        </>
    )
}