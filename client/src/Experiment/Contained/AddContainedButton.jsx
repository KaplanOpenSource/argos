import { MergeType } from "@mui/icons-material"
import { ButtonTooltip } from "../../Utils/ButtonTooltip"
import { useContext } from "react";
import { experimentContext } from "../../Context/ExperimentProvider";
import { ContextMenu } from "../../Utils/ContextMenu";
import { useCurrTrial } from "../../Context/useCurrTrial";

export const AddContainedButton = ({ deviceItem, deviceType }) => {
    const { selection, currTrial, setTrialData } = useContext(experimentContext);
    const { trial } = useCurrTrial({});
    const device = trial.getDevice(deviceType.name, deviceItem.name);

    const devicesOnTrial = ((currTrial.trial || {}).devicesOnTrial) || [];

    const { deviceItemName, deviceTypeName } = selection[0] || {};
    const topSelectedDevice = trial.getDevice(deviceTypeName, deviceItemName);
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
            if (topSelectedDevice.isContainedIn(device)) {
                topSelectedDevice.setContainedIn(undefined);
            } else {
                topSelectedDevice.setContainedIn(device);
            }
        }
    }

    const tooltip = disabled
        ? 'Device cannot contain itself, select another device'
        : (topSelectedIsContained
            ? 'Remove the top selected device from being contained in this'
            : 'Add the top selected device to be contained in this');

    const menuItems = [
        { label: tooltip, callback: handleClick },
        {
            label: 'Add all selected devices to be contained in this', callback: () => {
                const draft = trial.createDraft();
                for (const { deviceTypeName, deviceItemName } of selection) {
                    const s = draft.getDevice(deviceTypeName, deviceItemName);
                    s.setContainedIn(device);
                }
                trial.setTrialData(draft.getTrialData());
            }
        },
        {
            label: 'Remove all selected devices that are also contained in this', callback: () => {
                const draft = trial.createDraft();
                for (const { deviceTypeName, deviceItemName } of selection) {
                    const s = draft.getDevice(deviceTypeName, deviceItemName);
                    if (s.isContainedIn(device)) {
                        s.setContainedIn(undefined);
                    }
                }
                trial.setTrialData(draft.getTrialData());
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