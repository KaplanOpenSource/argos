import { PlaylistAdd } from "@mui/icons-material";
import { useContext } from "react";
import { experimentContext } from "../Context/ExperimentProvider";
import { ButtonTooltip } from "../Utils/ButtonTooltip";

export const SelectDeviceButton = ({ deviceType, deviceItem }) => {
    const { selection, setSelection } = useContext(experimentContext);
    const selectedIndex = selection.findIndex(({ deviceTypeName, deviceItemName }) => {
        return deviceTypeName === deviceType.name && deviceItemName === deviceItem.name;
    });
    const isSelected = selectedIndex !== -1;
    return (
        <ButtonTooltip
            tooltip={isSelected ? "Remove from list" : "Add to list"}
            onClick={(e) => {
                e.stopPropagation();
                if (isSelected) {
                    setSelection(selection.filter((_, i) => i !== selectedIndex));
                } else {
                    setSelection([...selection, { deviceTypeName: deviceType.name, deviceItemName: deviceItem.name }]);
                }
            }}
        >
            <PlaylistAdd color={isSelected ? "primary" : ""} />
        </ButtonTooltip>
    )
}
