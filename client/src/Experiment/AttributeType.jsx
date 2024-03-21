import { FormControlLabel, IconButton, MenuItem, Select, Switch } from "@mui/material";
import { TreeRow } from "../App/TreeRow";
import { AttributeValue, valueTypeDefault, valueTypes } from "./AttributeValue";
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
                        value={data.type || valueTypeDefault}
                        size="small"
                        label="Type"
                        onChange={(e) => setData({ ...data, type: e.target.value })}
                    >
                        {valueTypes.map(t => (
                            <MenuItem key={t} value={t}>{t}</MenuItem>
                        ))}
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
                type={data.type || valueTypeDefault}
                data={data.defaultValue}
                setData={val => setData({ ...data, defaultValue: val })}
            />
        </TreeRow>
    )
}
