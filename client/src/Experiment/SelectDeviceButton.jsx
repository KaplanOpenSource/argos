import { PlaylistAdd } from "@mui/icons-material";
import { IconButton } from "@mui/material";
import { useContext } from "react";
import { experimentContext } from "../Context/ExperimentProvider";

export const SelectDeviceButton = ({ deviceType, deviceItem }) => {
    const { selection, setSelection } = useContext(experimentContext);
    const selectedIndex = selection.findIndex(({ deviceTypeName, deviceItemName }) => {
        return deviceTypeName === deviceType.name && deviceItemName === deviceItem.name;
    });
    const isSelected = selectedIndex !== -1;
    return (
        <IconButton
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
        </IconButton>
    )
}