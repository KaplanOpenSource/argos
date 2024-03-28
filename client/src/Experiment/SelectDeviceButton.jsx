import { PlaylistAdd } from "@mui/icons-material";
import { useContext } from "react";
import { experimentContext } from "../Context/ExperimentProvider";
import { ButtonTooltip } from "../Utils/ButtonTooltip";
import { ContextMenu } from "../Utils/ContextMenu";

export const SelectDeviceButton = ({ deviceType, deviceItem, devicesEnclosingList }) => {
    const { selection, setSelection, currTrial } = useContext(experimentContext);
    const selectedIndex = selection.findIndex(({ deviceTypeName, deviceItemName }) => {
        return deviceTypeName === deviceType.name && deviceItemName === deviceItem.name;
    });
    const isSelected = selectedIndex !== -1;
    const hasTrial = currTrial.trial;
    return (
        <ContextMenu menuItems={[
            {
                label: 'Select all',
                callback: () => {
                    const newSelection = selection.slice();
                    for (const t of devicesEnclosingList) {
                        if (!selection.find(s => s.deviceItemName === t.deviceItemName && s.deviceTypeName === t.deviceTypeName)) {
                            newSelection.push(t);
                        }
                    }
                    setSelection(newSelection);
                }
            },
            {
                label: 'Deselect all',
                callback: () => {
                    const newSelection = [];
                    for (const s of selection) {
                        if (!devicesEnclosingList.find(t => t.deviceItemName === s.deviceItemName && t.deviceTypeName === s.deviceTypeName)) {
                            newSelection.push(s);
                        }
                    }
                    setSelection(newSelection);
                }
            }
        ]}>
            <ButtonTooltip
                tooltip={hasTrial
                    ? (isSelected ? "Remove from selected devices" : "Select device")
                    : "Selecting devices is possible only when a trial is edited"}
                onClick={(e) => {
                    e.stopPropagation();
                    if (isSelected) {
                        setSelection(selection.filter((_, i) => i !== selectedIndex));
                    } else {
                        setSelection([...selection, { deviceTypeName: deviceType.name, deviceItemName: deviceItem.name }]);
                    }
                }}
                disabled={!hasTrial}
            >
                <PlaylistAdd color={hasTrial && isSelected ? "primary" : ""} />
            </ButtonTooltip>
        </ContextMenu>
    )
}
