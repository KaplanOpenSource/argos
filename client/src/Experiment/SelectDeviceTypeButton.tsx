import { PlaylistAdd } from "@mui/icons-material";
import {
  differenceWith,
} from 'lodash';
import React from "react";
import { useExperimentProvider } from "../Context/ExperimentProvider";
import { useDeviceSeletion } from "../Context/useDeviceSeletion";
import { IDeviceType, IDeviceTypeAndItem, ITrial } from "../types/types";
import { ButtonTooltip } from "../Utils/ButtonTooltip";
import { ContextMenu } from "../Utils/ContextMenu";
import { isSameDevice } from "../Utils/isSameDevice";

export const SelectDeviceTypeButton = ({
  deviceType,
}: {
  deviceType: IDeviceType,
}) => {
  const { selection, setSelection } = useDeviceSeletion();
  const { currTrial } = useExperimentProvider();
  const trial = currTrial.trial as ITrial;

  const devicesForSelection = (): IDeviceTypeAndItem[] => {
    return (deviceType.devices || []).map(item => {
      return { deviceTypeName: deviceType.name!, deviceItemName: item.name! };
    });
  }

  const selectAll = () => {
    const added = differenceWith(devicesForSelection(), selection, isSameDevice);
    setSelection([...selection, ...added]);
  }

  const selectAllPlaced = () => {
    const added = differenceWith(devicesForSelection(), selection, isSameDevice);
    const filtered = added.filter(a => trial.devicesOnTrial?.find(d => isSameDevice(a, d)));
    setSelection([...selection, ...filtered]);
  }

  const deselectAll = () => {
    const added = differenceWith(selection, devicesForSelection(), isSameDevice);
    setSelection(added);
  }

  const menuItems = [
    { label: 'Select all devices of this type', callback: selectAll },
    { label: 'Select devices of this type that are placed', callback: selectAllPlaced },
    { label: 'Deselect all devices of this type', callback: deselectAll }
  ];

  return (
    <ContextMenu menuItems={menuItems}>
      <ButtonTooltip
        tooltip={trial
          ? "Select all devices of this type"
          : "Selecting devices is possible only when a trial is edited"}
        onClick={() => selectAll()}
        disabled={!trial}
      >
        {<PlaylistAdd color={"inherit"} />}
      </ButtonTooltip>
    </ContextMenu>
  )
}
