import { FormControlLabel, MenuItem, Select, Switch } from "@mui/material";
import { DateProperty } from "./DateProperty";
import { TreeRow } from "./TreeRow";

export const AttributeType = ({ name, data, setData }) => {
    return (
        <TreeRow
            key={name}
            name={name}
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
                    {/* <DateProperty data={data} setData={setData}
                        label="Created Date"
                        field="createdDate"
                    /> */}
                </>
            }
        >
            {/* {
                (data.trailSet || []).map(e => (
                    <TrailSet
                        key={e.name}
                        name={e.name}
                        data={e.data}
                    />
                ))
            } */}
        </TreeRow>
    )
}
