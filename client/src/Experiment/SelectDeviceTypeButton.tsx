import { PlaylistAdd } from "@mui/icons-material";
import { useExperimentProvider } from "../Context/ExperimentProvider";
import { ButtonTooltip } from "../Utils/ButtonTooltip";
import React from "react";
import {
    differenceWith,
} from 'lodash';
import { useDeviceSeletion } from "../Context/useDeviceSeletion";
import { IDeviceType, IDeviceTypeAndItem } from "../types/types";

export const SelectDeviceTypeButton = ({
    deviceType,
}: {
    deviceType: IDeviceType,
}) => {
    const { selection, setSelection } = useDeviceSeletion();
    const { currTrial } = useExperimentProvider();
    const hasTrial = currTrial.trial;

    const isSameDevice = (one: IDeviceTypeAndItem, two: IDeviceTypeAndItem) => {
        return one.deviceItemName === two.deviceItemName && one.deviceTypeName === two.deviceTypeName
    }

    const handleClick = () => {
        const devices: IDeviceTypeAndItem[] = (deviceType.devices || []).map(item => {
            return { deviceTypeName: deviceType.name!, deviceItemName: item.name! };
        });
        const added = differenceWith(devices, selection, isSameDevice);
        setSelection([...selection, ...added]);
    }

    return (
        // <ContextMenu menuItems={menuItems}>
        <ButtonTooltip
            tooltip={hasTrial
                ? "Select all devices of this type"
                : "Selecting devices is possible only when a trial is edited"}
            onClick={() => handleClick()}
            disabled={!hasTrial}
        >
            {<PlaylistAdd color={"inherit"} />}
        </ButtonTooltip>
        // </ContextMenu>
    )
}
