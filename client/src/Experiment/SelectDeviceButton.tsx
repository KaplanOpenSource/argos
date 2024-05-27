import { PlaylistAdd } from "@mui/icons-material";
import { useContext } from "react";
import { experimentContext } from "../Context/ExperimentProvider";
import { ButtonTooltip } from "../Utils/ButtonTooltip";
import { ContextMenu } from "../Utils/ContextMenu";
import React from "react";
import {
    differenceWith,
} from 'lodash';

export const SelectDeviceButton = ({ deviceType, deviceItem, devicesEnclosingList, selectionOnEnclosingList }) => {
    const { selection, setSelection, currTrial } = useContext(experimentContext);
    const selectedIndex: number = selection.findIndex(({ deviceTypeName, deviceItemName }) => {
        return deviceTypeName === deviceType.name && deviceItemName === deviceItem.name;
    });
    const isSelected: boolean = selectedIndex !== -1;
    const hasTrial: boolean = currTrial.trial;

    const isSameDevice = (
        one: { deviceItemName: string; deviceTypeName: string; },
        two: { deviceItemName: any; deviceTypeName: any; }
    ) => {
        return one.deviceItemName === two.deviceItemName && one.deviceTypeName === two.deviceTypeName
    }

    const selectAll = () => {
        const added = differenceWith(devicesEnclosingList || [], selection, isSameDevice);
        setSelection([...selection, ...added]);
    }

    const deselectAll = () => {
        const added = differenceWith(selection, devicesEnclosingList || [], isSameDevice);
        setSelection(added);
    }

    const doMultipleSelection = devicesEnclosingList && selectionOnEnclosingList && selectionOnEnclosingList.length > 1;

    const menuItems: {
        label: string;
        callback: () => void;
    }[] = [];
    if (devicesEnclosingList) {
        menuItems.push(
            { label: 'Select all', callback: selectAll },
            { label: 'Deselect all', callback: deselectAll }
        )
        // if ( )
    }

    const handleClick = () => {
        if (doMultipleSelection) {

        } else {
            if (isSelected) {
                setSelection(selection.filter((_, i) => i !== selectedIndex));
            } else {
                setSelection([...selection, { deviceTypeName: deviceType.name, deviceItemName: deviceItem.name }]);
            }
        }
    }

    return (
        <ContextMenu menuItems={menuItems}>
            <ButtonTooltip
                tooltip={hasTrial
                    ? (isSelected ? "Remove from selected devices" : "Select device")
                    : "Selecting devices is possible only when a trial is edited"}
                onClick={(e) => {
                    e.stopPropagation();
                    handleClick();
                }}
                disabled={!hasTrial}
            >
                <PlaylistAdd color={hasTrial && isSelected ? "primary" : "inherit"} />
            </ButtonTooltip>
        </ContextMenu>
    )
}
