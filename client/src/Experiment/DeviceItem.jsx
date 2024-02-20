import { Button, IconButton } from "@mui/material";
import { TreeRow } from "../App/TreeRow";
import { useContext } from "react";
import { experimentContext } from "./ExperimentProvider";
import DeleteIcon from '@mui/icons-material/Delete';
import { PlaylistAdd } from "@mui/icons-material";
import { AttributeValue } from "./AttributeValue";
import { changeByName } from "../Utils/utils";
import { AttributeItemList } from "./AttributeItemList";

export const DeviceItem = ({ data, setData, deviceType }) => {
    const { selection, setSelection } = useContext(experimentContext);
    const selectedIndex = selection.findIndex(({ deviceTypeName, deviceItemName }) => {
        return deviceTypeName === deviceType.name && deviceItemName === data.name;
    });
    const isSelected = selectedIndex !== -1;
    return (
        <TreeRow
            key={data.name}
            data={data}
            setData={setData}
            components={
                <>
                    <IconButton
                        onClick={(e) => {
                            if (isSelected) {
                                setSelection(selection.filter((_, i) => i !== selectedIndex));
                            } else {
                                setSelection([...selection, { deviceTypeName: deviceType.name, deviceItemName: data.name }]);
                            }
                            e.stopPropagation();
                        }}
                    >
                        <PlaylistAdd color={isSelected ? "primary" : ""} />
                    </IconButton>
                    <IconButton
                        onClick={() => setData(undefined)}
                    >
                        <DeleteIcon />
                    </IconButton>
                </>
            }
        >
            <AttributeItemList
                attributeTypes={deviceType.attributeTypes}
                data={data}
                setData={setData}
            />
        </TreeRow>
    )
}
