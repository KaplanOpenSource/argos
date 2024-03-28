import { FormControlLabel, IconButton, MenuItem, Select, Switch } from "@mui/material";
import { TreeRow } from "../App/TreeRow";
import { AttributeValue, VALUE_TYPE_SELECT, valueTypeDefault, valueTypes } from "./AttributeValue";
import DeleteIcon from '@mui/icons-material/Delete';
import { TreeSublist } from "../App/TreeSublist";
import { BooleanProperty } from "../Utils/BooleanProperty";
import { SelectProperty } from "../Utils/SelectProperty";

export const AttributeType = ({ data, setData, omitExperimentScope }) => {
    const scopes = omitExperimentScope ? ["Trial", "Constant"] : ["Trial", "Experiment", "Constant"];
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
                    <SelectProperty
                        label="Type"
                        data={data.type || valueTypeDefault}
                        setData={type => setData({ ...data, type })}
                        options={valueTypes.map(name => { return { name } })}
                    />
                    <SelectProperty
                        label="Scope"
                        data={data.scope || "Trial"}
                        setData={scope => setData({ ...data, scope })}
                        options={scopes.map(name => { return { name } })}
                    />
                    <IconButton
                        onClick={() => setData(undefined)}
                    >
                        <DeleteIcon />
                    </IconButton>
                </>
            }
        >
            {data.type === VALUE_TYPE_SELECT &&
                <TreeSublist
                    parentKey={data.name}
                    data={data}
                    fieldName='options'
                    nameTemplate='New Option'
                    setData={setData}
                    components={
                        <>
                            <BooleanProperty
                                label={'multiple'}
                                data={data.multiple}
                                setData={v => setData({ ...data, multiple: v })}
                            />
                        </>
                    }
                >
                    {
                        (data.options || []).map(itemData => (
                            <TreeRow
                                key={itemData.name}
                                data={itemData}
                                setData={newData => {
                                    setData({ ...data, options: changeByName(data.options, itemData.name, newData) });
                                }}
                                withDescription={false}
                                components={
                                    <>
                                        <IconButton
                                            onClick={() => setData({ ...data, options: data.options.filter(t => t.name !== itemData.name) })}
                                        >
                                            <DeleteIcon />
                                        </IconButton>
                                    </>
                                }
                            >
                            </TreeRow>
                        ))
                    }
                </TreeSublist>
            }
            <AttributeValue
                label='Default'
                type={data.type || valueTypeDefault}
                data={data.defaultValue}
                setData={val => setData({ ...data, defaultValue: val })}
                attrType={data}
            />
        </TreeRow>
    )
}
