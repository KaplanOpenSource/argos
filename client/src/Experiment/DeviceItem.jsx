import { Button, IconButton } from "@mui/material";
import { TreeRow } from "../App/TreeRow";
import { useContext } from "react";
import { experimentContext } from "./ExperimentProvider";
import DeleteIcon from '@mui/icons-material/Delete';
import { PlaylistAdd } from "@mui/icons-material";
import { AttributeValue } from "./AttributeValue";
import { changeByName } from "../Utils/utils";

export const DeviceItem = ({ data, setData, deviceType }) => {
    const { selection, setSelection } = useContext(experimentContext);
    const selectedIndex = selection.findIndex(({ deviceTypeName, deviceItemName }) => {
        return deviceTypeName === deviceType.name && deviceItemName === data.name;
    });
    const isSelected = selectedIndex !== -1;
    const attributes = data.attributes || [];
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
            {
                (deviceType.attributeTypes || []).map(attrType => (
                    <AttributeValue
                        key={attrType.name}
                        label={attrType.name}
                        type={attrType.type || 'String'}
                        data={(attributes.find(t => t.name === attrType.name) || { value: '' }).value}
                        setData={newData => {
                            const attrValue = { name: attrType.name, value: newData };
                            setData({ ...data, attributes: changeByName(attributes, attrType.name, attrValue) });
                        }}
                    />
                ))
            }
        </TreeRow>
    )
}
