import { PlaylistAdd, PlaylistRemove } from "@mui/icons-material";
import {
  differenceWith,
  uniq,
} from 'lodash';
import React, { useContext } from "react";
import { useExperimentProvider } from "../Context/ExperimentProvider";
import { useDeviceSeletion } from "../Context/useDeviceSeletion";
import { ButtonTooltip } from "../Utils/ButtonTooltip";
import { ContextMenu } from "../Utils/ContextMenu";
import { isSameDevice } from "../Utils/isSameDevice";
import { EnclosingListSelectionContext } from "./EnclosedSelectionProvider";

export const SelectDeviceButton = ({ deviceType, deviceItem, devicesEnclosingList }) => {
  const { selection, setSelection } = useDeviceSeletion();
  const { currTrial } = useExperimentProvider();
  const { selectionOnEnclosingUuids } = useContext(EnclosingListSelectionContext);
  const selectedIndex = selection.findIndex(({ deviceTypeName, deviceItemName }) => {
    return deviceTypeName === deviceType.name && deviceItemName === deviceItem.name;
  });
  const isSelected = selectedIndex !== -1;
  const hasTrial = currTrial.trial;

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
        onClick={() => handleClick()}
        disabled={!hasTrial}
      >
        {hasTrial && isSelected
          ? <PlaylistRemove color={"primary"} />
          : <PlaylistAdd color={"inherit"} />
        }
      </ButtonTooltip>
    </ContextMenu>
  )
}
