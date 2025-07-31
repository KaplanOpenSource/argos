import { MergeType } from "@mui/icons-material";
import { useChosenTrial } from "../../Context/useChosenTrial";
import { useDeviceSeletion } from "../../Context/useDeviceSeletion";
import { DeviceOnTrialObj } from "../../objects";
import { IDeviceTypeAndItem } from "../../types/types";
import { ButtonTooltip } from "../../Utils/ButtonTooltip";
import { ContextMenu } from "../../Utils/ContextMenu";
import { isSameDevice } from "../../Utils/isSameDevice";

export const AddContainedButton = ({
  deviceOnTrial,
  hasContainedDevices,
}: {
  deviceOnTrial: DeviceOnTrialObj,
  hasContainedDevices: boolean,
}) => {
  const { selection, setSelection } = useDeviceSeletion();
  const { changeTrialObj } = useChosenTrial();

  const removeAll = () => {
    // preparing new selection
    const newSelection: IDeviceTypeAndItem[] = deviceOnTrial.getContainedDevices().map(x => x.dev.asNames());

    changeTrialObj(draft => {
      const contained = draft.findDevice(deviceOnTrial)?.getContainedDevices()
      contained?.forEach(c => c.dev.setContainedIn(undefined));
    });

    for (const os of selection) {
      if (!newSelection.find(ns => isSameDevice(ns, os))) {
        newSelection.push(os);
      }
    }
    setSelection(newSelection)
  };

  const addAllSelected = () => {
    changeTrialObj(draft => {
      const dev = draft.findDevice(deviceOnTrial);
      for (const s of selection) {
        if (!dev?.isSame(s)) {
          draft.findDevice(s, true)?.setContainedIn(dev)
        }
      }
    });
    setSelection([]);
  };

  const menuItems = [{
    label: 'Add just top selected device to be contained in this',
    callback: () => {
      changeTrialObj(draft => draft.findDevice(selection[0], true)?.setContainedIn(draft.findDevice(deviceOnTrial)))
    }
  }, {
    label: 'Add all selected devices to be contained in this',
    callback: addAllSelected
  }, {
    label: 'Remove all contained devices',
    callback: removeAll
  }];

  const handleClick = () => {
    if (hasContainedDevices) {
      removeAll();
    } else {
      addAllSelected()
    }
  }

  const tooltip = hasContainedDevices
    ? 'Remove all contained devices'
    : 'Add all selected devices to be contained in this';

  return (
    <ContextMenu
      menuItems={menuItems}
    >
      <ButtonTooltip
        tooltip={tooltip}
        onClick={handleClick}
        color={hasContainedDevices ? "primary" : "default"}
      >
        <MergeType />
      </ButtonTooltip>
    </ContextMenu>
  )
}