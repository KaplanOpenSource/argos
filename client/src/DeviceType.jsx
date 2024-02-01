import { Box, Collapse, IconButton, List, ListItem, ListItemButton, ListItemIcon, ListItemText, TextField, Typography } from "@mui/material"
import AddIcon from '@mui/icons-material/Add';
import { TreeItem } from "@mui/x-tree-view/TreeItem";
import { TreeRow } from "./TreeRow";
import { DeviceItem } from "./DeviceItem";
import { TreeSublist } from "./TreeSublist";
import { AttributeType } from "./AttributeType";

export const DeviceType = ({ name, data, setData }) => {
    return (
        <TreeRow
            key={name}
            name={name}
            data={data}
            setData={setData}
            components={
                <>
                </>
            }
        >
            <TreeSublist
                data={data}
                fieldName='devices'
                nameTemplate='new_device'
                setData={setData}
                component={(name, data, setData) => (
                    <DeviceItem
                        key={name}
                        name={name}
                        data={data}
                        setData={setData}
                    />
                )}
            />

            <TreeSublist
                data={data}
                fieldName='attributeTypes'
                nameTemplate='new_attribute_type'
                setData={setData}
                component={(name, data, setData) => (
                    <AttributeType
                        key={name}
                        name={name}
                        data={data}
                        setData={setData}
                    />
                )}
            />

        </TreeRow>
    )
}
