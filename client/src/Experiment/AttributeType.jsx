import { FormControlLabel, IconButton, MenuItem, Select, Switch } from "@mui/material";
import { TreeRow } from "../App/TreeRow";
import { AttributeValue } from "./AttributeValue";
import DeleteIcon from '@mui/icons-material/Delete';

export const AttributeType = ({ data, setData }) => {
    return (
        <TreeRow
            key={data.name}
            data={data}
            setData={setData}
            components={
                <>
                    <FormControlLabel
                        label="Required"
                        control={
                            <Switch
                                checked={data.required}
                                onChange={(e) => setData({ ...data, required: e.target.checked })}
                            />
                        }
                    />
                    <Select
                        value={data.type || 'String'}
                        size="small"
                        label="Type"
                        onChange={(e) => setData({ ...data, type: e.target.value })}
                    >
                        <MenuItem value={'String'}>String</MenuItem>
                        <MenuItem value={'Number'}>Number</MenuItem>
                    </Select>
                    <IconButton
                        onClick={() => setData(undefined)}
                    >
                        <DeleteIcon />
                    </IconButton>
                </>
            }
        >
            <AttributeValue
                label='Default'
                type={data.type || 'String'}
                data={data.defaultValue}
                setData={val => setData({ ...data, defaultValue: val })}
            />
        </TreeRow>
    )
}
