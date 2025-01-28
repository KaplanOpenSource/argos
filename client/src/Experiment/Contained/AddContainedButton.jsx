import { MergeType } from "@mui/icons-material"
import { ButtonTooltip } from "../../Utils/ButtonTooltip"
import { ContextMenu } from "../../Utils/ContextMenu";
import { useCurrTrial } from "../../Context/useCurrTrial";
import { isSameName } from "../../Context/DeviceObject";
import { useDeviceSeletion } from "../../Context/useDeviceSeletion";

export const AddContainedButton = ({ deviceItem, deviceType, hasContainedDevices }) => {
    const { selection, setSelection } = useDeviceSeletion();
    const { trial } = useCurrTrial({});
    const device = trial.getDevice(deviceType.name, deviceItem.name);

    const { deviceItemName, deviceTypeName } = selection[0] || {};
    const topSelectedDevice = trial.getDevice(deviceTypeName, deviceItemName);

    const removeAll = () => {
        const draft = trial.createDraft();
        const newSelection = [];
        for (const d of draft.getDevicesOnTrial()) {
            if (d.checkParentIs(device)) {
                d.setParent(undefined);
                newSelection.push(d.name());
            }
        }
        trial.setTrialData(draft.getTrialData());

        const oldSelection = [];
        for (const olds of selection) {
            if (!newSelection.find(news => isSameName(news, olds))) {
                oldSelection.push(olds);
            }
        }

        setSelection([...newSelection, ...oldSelection])
    };
    const removeAllSelected = () => {
        const draft = trial.createDraft();
        for (const s of draft.getDevicesByNames(selection)) {
            if (s.checkParentIs(device)) {
                s.setParent(undefined);
            }
        }
        trial.setTrialData(draft.getTrialData());
    };
    const addAllSelected = () => {
        const draft = trial.createDraft();
        for (const s of draft.getDevicesByNames(selection)) {
            s.setParent(device);
        }
        trial.setTrialData(draft.getTrialData());
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