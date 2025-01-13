import { NotListedLocation, PersonPinCircle, Place, PlaceOutlined } from "@mui/icons-material"
import { ButtonTooltip } from "../Utils/ButtonTooltip"
import { useContext } from "react";
import { experimentContext } from "../Context/ExperimentProvider";
import { RealMapName } from "../constants/constants";
import { ContextMenu } from "../Utils/ContextMenu";
import { useCurrTrial } from "../Context/useCurrTrial";

export const DeviceItemLocationButton = ({
    deviceType,
    deviceItem,
    surroundingDevices,
}) => {
    const { currTrial, setLocationsToDevices } = useContext(experimentContext);

    const { trial } = useCurrTrial({});
    const device = trial.getDevice(deviceType.name, deviceItem.name);

    const hasLocation = device.hasLocationOnMap(currTrial?.shownMapName || RealMapName);
    const hasParent = device.hasParent()

    const removeLocation = () => {
        setLocationsToDevices([{ deviceTypeName: deviceType.name, deviceItemName: deviceItem.name }], [undefined]);
    }

    const menuItems = [
        {
            label: 'Remove location',
            callback: removeLocation
        },
    ];

    if (surroundingDevices) {
        menuItems.push({
            label: 'Remove locations to all devices in list',
            callback: () => {
                const devicesToRemove = surroundingDevices.map(d => {
                    return { deviceTypeName: d.deviceType.name, deviceItemName: d.deviceItem.name };
                });
                const locationsEmpty = devicesToRemove.map(() => undefined);
                setLocationsToDevices(devicesToRemove, locationsEmpty);
            }
        })
    }

    let tooltip;
    if (hasLocation && hasParent) {
        tooltip = 'Has location and parent, remove both';
    } else if (!hasLocation && hasParent) {
        tooltip = 'Remove from parent';
    } else if (hasLocation && !hasParent) {
        tooltip = 'Remove location';
    } else if (!hasLocation && !hasParent) {
        tooltip = 'Has no location';
    }

    return (
        <>
            {currTrial.trial && (
                <ContextMenu menuItems={menuItems}>
                    <ButtonTooltip
                        tooltip={tooltip}
                        onClick={removeLocation}
                        disabled={!hasLocation}
                    >
                        {hasLocation
                            ? (hasParent
                                ? <NotListedLocation />
                                : <Place />
                            )
                            : (hasParent
                                ? <PersonPinCircle />
                                : <PlaceOutlined />
                            )
                        }
                    </ButtonTooltip>
                </ContextMenu>
            )}
        </>
    )
}