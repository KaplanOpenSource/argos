import { MergeType } from "@mui/icons-material"
import { ButtonTooltip } from "../../Utils/ButtonTooltip"
import { useContext } from "react";
import { experimentContext } from "../../Context/ExperimentProvider";

export const AddContainedButton = ({ deviceItem, deviceType, deviceOnTrial }) => {
    const { selection, setSelection, currTrial, setTrialData } = useContext(experimentContext);
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

    const handleClick = () => {
        if (!disabled) {
            const dev = { ...(topSelected || {}) };
            if (topSelectedIsContained) {
                delete dev.containedIn;
            } else {
                dev.containedIn = { deviceItemName: deviceItem.name, deviceTypeName: deviceType.name }
            }
            const devs = [...devicesOnTrial];
            if (topSelectedIndex !== -1) {
                devs[topSelectedIndex] = dev;
            } else {
                devs.push(dev);
            }
            setTrialData({ ...currTrial.trial, devicesOnTrial: devs });
        }
    }

    return (
        <ButtonTooltip
            disabled={disabled}
            tooltip={disabled
                ? 'To add a contained device, the top selected device should be a different one'
                : (topSelectedIsContained
                    ? 'Remove the top selected device from being contained in this'
                    : 'Add the top selected device to be contained in this')}
            onClick={handleClick}
            color={topSelectedIsContained ? "primary" : ""}
        >
            <MergeType />
        </ButtonTooltip>
    )
}