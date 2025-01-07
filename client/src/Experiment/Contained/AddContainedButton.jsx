import { MergeType } from "@mui/icons-material"
import { ButtonTooltip } from "../../Utils/ButtonTooltip"
import { useContext } from "react";
import { experimentContext } from "../../Context/ExperimentProvider";
import { ContextMenu } from "../../Utils/ContextMenu";
import { useCurrTrial } from "../../Context/useCurrTrial";

export const AddContainedButton = ({ deviceItem, deviceType }) => {
    const { selection, currTrial } = useContext(experimentContext);
    const { trial } = useCurrTrial({});
    const device = trial.getDevice(deviceType.name, deviceItem.name);

    const { deviceItemName, deviceTypeName } = selection[0] || {};
    const topSelectedDevice = trial.getDevice(deviceTypeName, deviceItemName);

    const disabled = !currTrial.trial || selection.length === 0 || topSelectedDevice.isSame(device);

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
        : (topSelectedDevice.isContainedIn(device)
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
                const draft = trial.createDraft();
                for (const d of draft.getDevicesOnTrial()) {
                    if (d.isContainedIn(device)) {
                        d.setContainedIn(undefined);
                    }
                }
                trial.setTrialData(draft.getTrialData());
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
                color={topSelectedDevice.isContainedIn(device) ? "primary" : ""}
            >
                <MergeType />
            </ButtonTooltip>
        </ContextMenu>
    )
}