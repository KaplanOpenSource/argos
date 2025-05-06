import { MergeType } from "@mui/icons-material";
import { isSameName } from "../../Context/DeviceObject";
import { useCurrTrial } from "../../Context/useCurrTrial";
import { useDeviceSeletion } from "../../Context/useDeviceSeletion";
import { ButtonTooltip } from "../../Utils/ButtonTooltip";
import { ContextMenu } from "../../Utils/ContextMenu";

export const AddContainedButton = ({ deviceItem, deviceType, hasContainedDevices }) => {
  const { selection, setSelection } = useDeviceSeletion();
  const { trial } = useCurrTrial({});
  const device = trial.getDevice(deviceType.name, deviceItem.name);

  const { deviceItemName, deviceTypeName } = selection[0] || {};
  const topSelectedDevice = trial.getDevice(deviceTypeName, deviceItemName);

  const removeAll = () => {
    const newSelection = [];

    trial.batch(draft => {
      for (const d of draft.getDevicesOnTrial()) {
        if (d.checkParentIs(device)) {
          d.setParent(undefined);
          newSelection.push(d.name());
        }
      }
    });

    const oldSelection = [];
    for (const olds of selection) {
      if (!newSelection.find(news => isSameName(news, olds))) {
        oldSelection.push(olds);
      }
    }

    setSelection([...newSelection, ...oldSelection])
  };
  const removeAllSelected = () => {
    trial.batch(draft => {
      for (const s of draft.getDevicesByNames(selection)) {
        if (s.checkParentIs(device)) {
          s.setParent(undefined);
        }
      }
    });
  };
  const addAllSelected = () => {
    trial.batch(draft => {
      for (const s of draft.getDevicesByNames(selection)) {
        s.setParent(device);
      }
    });
    setSelection([]);
  };

  const menuItems = [{
    label: 'Add just top selected device to be contained in this',
    callback: () => topSelectedDevice.setParent(undefined)
  }, {
    label: 'Remove just top selected device from being contained in this',
    callback: () => topSelectedDevice.setParent(device)
  }, {
    label: 'Add all selected devices to be contained in this',
    callback: addAllSelected
  }, {
    label: 'Remove all contained devices',
    callback: removeAll
  }, {
    label: 'Remove just selected devices that are also contained in this',
    callback: removeAllSelected
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
        color={hasContainedDevices ? "primary" : ""}
      >
        <MergeType />
      </ButtonTooltip>
    </ContextMenu>
  )
}