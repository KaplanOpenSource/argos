import { MergeType } from "@mui/icons-material"
import { ButtonTooltip } from "../../Utils/ButtonTooltip"
import { useContext } from "react";
import { experimentContext } from "../../Context/ExperimentProvider";
import { ContextMenu } from "../../Utils/ContextMenu";
import { useDevice } from "../../Context/useDevice";

export const AddContainedButton = ({ deviceItem, deviceType }) => {
    const { selection, currTrial, setTrialData } = useContext(experimentContext);
    const { device } = useDevice({ deviceTypeName: deviceType.name, deviceItemName: deviceItem.name });

    const devicesOnTrial = ((currTrial.trial || {}).devicesOnTrial) || [];

    const { deviceItemName, deviceTypeName } = selection[0] || {};
    const { device: topSelectedDevice } = useDevice({ deviceTypeName, deviceItemName });
    const topSelectedIsContained = topSelectedDevice.isContainedIn(device);

    let disabled = currTrial.trial && selection.length === 0;
    if (topSelectedDevice.isSame(device)) {
        disabled = true;
    }

    const addContained = (devicesOnTrialCopy, deviceItemParentName, deviceTypeParentName, deviceItemChildName, deviceTypeChildName) => {
        const containedIn = { deviceItemName: deviceItemParentName, deviceTypeName: deviceTypeParentName }
        const i = devicesOnTrialCopy.findIndex(t => t.deviceItemName === deviceItemChildName && t.deviceTypeName === deviceTypeChildName);
        if (i !== -1) {
            const dev = { ...devicesOnTrialCopy[i] };
            dev.containedIn = containedIn;
            devicesOnTrialCopy[i] = dev;
        } else {
            devicesOnTrialCopy.push({
                deviceTypeName: deviceTypeChildName,
                deviceItemName: deviceItemChildName,
                containedIn
            });
        }
    }

    const removeContained = (devicesOnTrialCopy, deviceItemChildName, deviceTypeChildName) => {
        const i = devicesOnTrialCopy.findIndex(t => t.deviceItemName === deviceItemChildName && t.deviceTypeName === deviceTypeChildName);
        if (i !== -1) {
            if (!devicesOnTrialCopy[i].location) {
                devicesOnTrialCopy.splice(i, 1);
            } else {
                const dev = { ...devicesOnTrialCopy[i] };
                delete dev.containedIn;
                devicesOnTrialCopy[i] = dev;
            }
        }
    }

    const isContainedInThis = (deviceOnTrial) => {
        return deviceOnTrial?.containedIn?.deviceItemName === deviceItem.name
            && deviceOnTrial?.containedIn?.deviceTypeName === deviceType.name;
    }

    const handleClick = () => {
        if (!disabled) {
            const devicesOnTrialCopy = [...devicesOnTrial];
            if (topSelectedIsContained) {
                removeContained(devicesOnTrialCopy, deviceItemName, deviceTypeName);
            } else {
                addContained(devicesOnTrialCopy, deviceItem.name, deviceType.name, deviceItemName, deviceTypeName);
            }
            setTrialData({ ...currTrial.trial, devicesOnTrial: devicesOnTrialCopy });
        }
    }

    const tooltip = disabled
        ? 'To add a contained device, select a device that is not this one'
        : (topSelectedIsContained
            ? 'Remove the top selected device from being contained in this'
            : 'Add the top selected device to be contained in this');

    const menuItems = [
        { label: tooltip, callback: handleClick },
        {
            label: 'Add all selected devices to be contained in this', callback: () => {
                const devicesOnTrialCopy = [...devicesOnTrial];
                for (const { deviceItemName, deviceTypeName } of selection) {
                    addContained(devicesOnTrialCopy, deviceItem.name, deviceType.name, deviceItemName, deviceTypeName);
                }
                setTrialData({ ...currTrial.trial, devicesOnTrial: devicesOnTrialCopy });
            }
        },
        {
            label: 'Remove all selected devices that are also contained in this', callback: () => {
                const devicesOnTrialCopy = [...devicesOnTrial];
                for (const { deviceItemName, deviceTypeName } of selection) {
                    removeContained(devicesOnTrialCopy, deviceItemName, deviceTypeName);
                }
                setTrialData({ ...currTrial.trial, devicesOnTrial: devicesOnTrialCopy });
            }
        },
        {
            label: 'Remove all contained devices',
            callback: () => {
                const devicesOnTrialCopy = [...devicesOnTrial];
                for (const d of devicesOnTrialCopy) {
                    if (isContainedInThis(d)) {
                        removeContained(devicesOnTrialCopy, d.deviceItemName, d.deviceTypeName);
                    }
                }
                setTrialData({ ...currTrial.trial, devicesOnTrial: devicesOnTrialCopy });
            }
        },
    ];

    return (
        <ContextMenu
            menuItems={menuItems}
        >
            <ButtonTooltip
                disabled={disabled}
                tooltip={tooltip}
                onClick={handleClick}
                color={topSelectedIsContained ? "primary" : ""}
            >
                <MergeType />
            </ButtonTooltip>
        </ContextMenu>
    )
}