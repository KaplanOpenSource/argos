import { MergeType } from "@mui/icons-material";
import { useChosenTrial } from "../../Context/useChosenTrial";
import { useDeviceSeletion } from "../../Context/useDeviceSeletion";
import { ButtonTooltip } from "../../Utils/ButtonTooltip";
import { ContextMenu } from "../../Utils/ContextMenu";
import { DeviceOnTrialObj } from "../../objects";

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
    // const newSelection = [...selection];

    changeTrialObj(draft => {
      const contained = draft.findDevice(deviceOnTrial)?.getContainedDevices()
      contained?.forEach(c => c.dev.setContainedIn(undefined));
    });

    // trial.batch(draft => {
    //   for (const d of draft.getDevicesOnTrial()) {
    //     if (d.checkParentIs(device)) {
    //       d.setParent(undefined);
    //       newSelection.push(d.name());
    //     }
    //   }
    // });

    // const oldSelection = [];
    // for (const olds of selection) {
    //   if (!newSelection.find(news => isSameName(news, olds))) {
    //     oldSelection.push(olds);
    //   }
    // }

    // setSelection([...newSelection, ...oldSelection])
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