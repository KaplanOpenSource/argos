import { Box, Collapse, IconButton, List, ListItem, ListItemButton, ListItemIcon, ListItemText, TextField, Typography } from "@mui/material"
import AddIcon from '@mui/icons-material/Add';
import { TreeItem } from "@mui/x-tree-view/TreeItem";
import { TreeRow } from "./TreeRow";
import { Trail } from "./Trail";
import { TreeSublist } from "./TreeSublist";
import { AttributeType } from "./AttributeType";

export const TrailType = ({ name, data, setData }) => {
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
                fieldName='trail'
                nameTemplate='new_trial'
                setData={setData}
                component={(name, data, setData) => (
                    <Trail
                        key={name}
                        name={name}
                        data={data}
                        setData={setData}
                    />
                )}
            />
            <TreeSublist
                data={data}
                fieldName='attributeType'
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
