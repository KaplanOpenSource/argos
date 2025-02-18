import { PlaylistAdd } from "@mui/icons-material";
import { useContext } from "react";
import { experimentContext } from "../Context/ExperimentProvider";
import { ButtonTooltip } from "../Utils/ButtonTooltip";
import { ContextMenu } from "../Utils/ContextMenu";
import React from "react";
import {
    differenceWith,
    uniq,
} from 'lodash';
import { EnclosingListSelectionContext } from "./EnclosedSelectionProvider";
import { useDeviceSeletion } from "../Context/useDeviceSeletion";

export const SelectDeviceButton = ({ deviceType, deviceItem, devicesEnclosingList }) => {
    const { selection, setSelection } = useDeviceSeletion();
    const { currTrial } = useContext(experimentContext);
    const { selectionOnEnclosingUuids } = useContext(EnclosingListSelectionContext);
    const selectedIndex = selection.findIndex(({ deviceTypeName, deviceItemName }) => {
        return deviceTypeName === deviceType.name && deviceItemName === deviceItem.name;
    });
    const isSelected = selectedIndex !== -1;
    const hasTrial = currTrial.trial;

    const isSameDevice = (one, two) => {
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

    const menuItems = [];
    if (devicesEnclosingList) {
        menuItems.push(
            { label: 'Select all', callback: selectAll },
            { label: 'Deselect all', callback: deselectAll }
        )
        // if ( )
    }

    const handleClick = () => {
        if (devicesEnclosingList && selectionOnEnclosingUuids) {
            const xrefUuidToDev = Object.fromEntries(devicesEnclosingList.map(d => [d.deviceItem.trackUuid, d]));
            const selOnEnclosingUuids = uniq([...selectionOnEnclosingUuids, deviceItem.trackUuid]);
            const selOnEnclosingDevs = selOnEnclosingUuids.map(u => xrefUuidToDev[u]).filter(x => x);

            if (isSelected) {
                setSelection(differenceWith(selection, selOnEnclosingDevs, isSameDevice));
            } else {
                const added = differenceWith(selOnEnclosingDevs, selection, isSameDevice);
                setSelection([...selection, ...added]);
            }
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
