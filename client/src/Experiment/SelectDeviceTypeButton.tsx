import { PlaylistAdd } from "@mui/icons-material";
import { useExperimentProvider } from "../Context/ExperimentProvider";
import { ButtonTooltip } from "../Utils/ButtonTooltip";
import React from "react";
import {
    differenceWith,
} from 'lodash';
import { useDeviceSeletion } from "../Context/useDeviceSeletion";
import { IDeviceType, IDeviceTypeAndItem } from "../types/types";
import { ContextMenu } from "../Utils/ContextMenu";
import { isSameDevice } from "../Utils/isSameDevice";

export const SelectDeviceTypeButton = ({
    deviceType,
}: {
    deviceType: IDeviceType,
}) => {
    const { selection, setSelection } = useDeviceSeletion();
    const { currTrial } = useExperimentProvider();
    const hasTrial = currTrial.trial;

    const devicesForSelection = (): IDeviceTypeAndItem[] => {
        return (deviceType.devices || []).map(item => {
            return { deviceTypeName: deviceType.name!, deviceItemName: item.name! };
        });
    }

    const selectAll = () => {
        const added = differenceWith(devicesForSelection(), selection, isSameDevice);
        setSelection([...selection, ...added]);
    }

    const deselectAll = () => {
        const added = differenceWith(selection, devicesForSelection(), isSameDevice);
        setSelection(added);
    }

    const menuItems = [
        { label: 'Select all devices of this type', callback: selectAll },
        { label: 'Deselect all devices of this type', callback: deselectAll }
    ];

    return (
        <ContextMenu menuItems={menuItems}>
            <ButtonTooltip
                tooltip={hasTrial
                    ? "Select all devices of this type"
                    : "Selecting devices is possible only when a trial is edited"}
                onClick={() => selectAll()}
                disabled={!hasTrial}
            >
                {<PlaylistAdd color={"inherit"} />}
            </ButtonTooltip>
        </ContextMenu>
    )
}
