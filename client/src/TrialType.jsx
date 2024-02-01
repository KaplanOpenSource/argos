import { Box, Collapse, IconButton, List, ListItem, ListItemButton, ListItemIcon, ListItemText, TextField, Typography } from "@mui/material"
import AddIcon from '@mui/icons-material/Add';
import { TreeItem } from "@mui/x-tree-view/TreeItem";
import { TreeRow } from "./TreeRow";
import { Trial } from "./Trial";
import { TreeSublist } from "./TreeSublist";
import { AttributeType } from "./AttributeType";
import dayjs from "dayjs";

export const TrialType = ({ name, data, setData }) => {
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
                fieldName='trials'
                nameTemplate='new_trial'
                setData={setData}
                component={(name, data, setData) => (
                    <Trial
                        key={name}
                        name={name}
                        data={data}
                        setData={setData}
                    />
                )}
                newDataCreator={() => {
                    return {
                        createdDate: dayjs().startOf('day'),
                    }
                }}
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
