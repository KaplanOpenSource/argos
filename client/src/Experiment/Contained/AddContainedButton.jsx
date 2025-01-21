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
            if (topSelectedDevice.checkParentIs(device)) {
                topSelectedDevice.setParent(undefined);
            } else {
                topSelectedDevice.setParent(device);
            }
        }
    }

    const tooltip = disabled
        ? 'Device cannot contain itself, select another device'
        : (topSelectedDevice.checkParentIs(device)
            ? 'Remove the top selected device from being contained in this'
            : 'Add the top selected device to be contained in this');

    const removeAll = () => {
        const draft = trial.createDraft();
        for (const d of draft.getDevicesOnTrial()) {
            if (d.checkParentIs(device)) {
                d.setParent(undefined);
            }
        }
        trial.setTrialData(draft.getTrialData());
    };
    const removeAllSelected = () => {
        const draft = trial.createDraft();
        for (const { deviceTypeName, deviceItemName } of selection) {
            const s = draft.getDevice(deviceTypeName, deviceItemName);
            if (s.checkParentIs(device)) {
                s.setParent(undefined);
            }
        }
        trial.setTrialData(draft.getTrialData());
    };
    const addAllSelected = () => {
        const draft = trial.createDraft();
        for (const { deviceTypeName, deviceItemName } of selection) {
            const s = draft.getDevice(deviceTypeName, deviceItemName);
            s.setParent(device);
        }
        trial.setTrialData(draft.getTrialData());
    };

    const menuItems = [{
        label: tooltip,
        callback: handleClick
    }, {
        label: 'Add all selected devices to be contained in this',
        callback: addAllSelected
    }, {
        label: 'Remove all selected devices that are also contained in this',
        callback: removeAllSelected
    }, {
        label: 'Remove all contained devices',
        callback: removeAll
    }];

    return (
        <ContextMenu
            menuItems={menuItems}
        >
            <ButtonTooltip
                disabled={disabled}
                tooltip={tooltip}
                onClick={handleClick}
                color={topSelectedDevice.checkParentIs(device) ? "primary" : ""}
            >
                <MergeType />
            </ButtonTooltip>
        </ContextMenu>
    )
}