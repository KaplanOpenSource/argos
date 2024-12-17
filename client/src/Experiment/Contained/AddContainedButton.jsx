import { MergeType } from "@mui/icons-material"
import { ButtonTooltip } from "../../Utils/ButtonTooltip"
import { useContext } from "react";
import { experimentContext } from "../../Context/ExperimentProvider";
import { ContextMenu } from "../../Utils/ContextMenu";

export const AddContainedButton = ({ deviceItem, deviceType }) => {
    const { selection, currTrial, setTrialData } = useContext(experimentContext);
    const devicesOnTrial = ((currTrial.trial || {}).devicesOnTrial) || [];

    const { deviceItemName, deviceTypeName } = selection[0] || {};
    const topSelectedIndex = devicesOnTrial.findIndex(t => t.deviceItemName === deviceItemName && t.deviceTypeName === deviceTypeName);
    const topSelected = topSelectedIndex === -1 ? undefined : devicesOnTrial[topSelectedIndex];
    const topSelectedIsContained = topSelected
        && topSelected.containedIn
        && topSelected.containedIn.deviceItemName === deviceItem.name
        && topSelected.containedIn.deviceTypeName === deviceType.name;

    let disabled = currTrial.trial && selection.length === 0;
    if (selection.length >= 1) {
        disabled = deviceItemName === deviceItem.name && deviceTypeName === deviceType.name;
    }

    const addContained = (devicesOnTrialCopy, deviceItemParentName, deviceTypeParentName, deviceItemChildName, deviceTypeChildName) => {
        const containedIn = { deviceItemName: deviceItemParentName, deviceTypeName: deviceTypeParentName }
        const i = devicesOnTrialCopy.findIndex(t => t.deviceItemName === deviceItemChildName && t.deviceTypeName === deviceTypeChildName);
        if (i !== -1) {
            devicesOnTrialCopy[i].containedIn = containedIn;
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
            delete devicesOnTrialCopy[i].containedIn;
            if (!devicesOnTrialCopy[i].location) {
                devicesOnTrialCopy.splice(i, 1);
            }
        }
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

            }
        },
        { label: 'Remove all selected devices to be contained in this', callback: () => { } },
        {
            label: 'Remove all contained devices',
            callback: () => {
                // const devs = [...devicesOnTrial];
                // if (topSelectedIndex !== -1) {
                //     devs[topSelectedIndex] = dev;
                // } else {
                //     devs.push(dev);
                // }
                // setTrialData({ ...currTrial.trial, devicesOnTrial: devs });
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