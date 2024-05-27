import { PlaylistAdd } from "@mui/icons-material";
import { useContext } from "react";
import { experimentContext } from "../Context/ExperimentProvider";
import { ButtonTooltip } from "../Utils/ButtonTooltip";
import { ContextMenu } from "../Utils/ContextMenu";
import {
    differenceWith,
} from 'lodash';

export const SelectDeviceButton = ({ deviceType, deviceItem, devicesEnclosingList }) => {
    const { selection, setSelection, currTrial } = useContext(experimentContext);
    const selectedIndex = selection.findIndex(({ deviceTypeName, deviceItemName }) => {
        return deviceTypeName === deviceType.name && deviceItemName === deviceItem.name;
    });
    const isSelected = selectedIndex !== -1;
    const hasTrial = currTrial.trial;

    const isSameDevice = (one, two) => {
        return one.deviceItemName === two.deviceItemName && one.deviceTypeName === two.deviceTypeName
    }

    const selectAll = () => {
        const added = differenceWith(devicesEnclosingList, selection, isSameDevice);
        setSelection([...selection, ...added]);
    }

    const deselectAll = () => {
        const added = differenceWith(selection, devicesEnclosingList, isSameDevice);
        setSelection(added);
    }

    return (
        <ContextMenu menuItems={[
            {
                label: 'Select all',
                callback: selectAll
            },
            {
                label: 'Deselect all',
                callback: deselectAll
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
