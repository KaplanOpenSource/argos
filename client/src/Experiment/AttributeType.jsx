import { FormControlLabel, IconButton, Switch } from "@mui/material";
import { TreeRow } from "../App/TreeRow";
import { AttributeValue, VALUE_TYPE_SELECT, valueTypeDefault, valueTypes } from "./AttributeValue";
import DeleteIcon from '@mui/icons-material/Delete';
import { TreeSublist } from "../App/TreeSublist";
import { BooleanProperty } from "../Utils/BooleanProperty";
import { SelectProperty } from "../Utils/SelectProperty";

export const SCOPE_TRIAL = "Trial";
export const SCOPE_EXPERIMENT = "Experiment";
export const SCOPE_CONSTANT = "Constant";
export const SCOPES_OF_DEVICE = [SCOPE_TRIAL, SCOPE_EXPERIMENT, SCOPE_CONSTANT];
export const SCOPES_OF_TRIAL = [SCOPE_TRIAL, SCOPE_CONSTANT];
export const AttributeType = ({ data, setData, isOfDevice }) => {
    const scopes = isOfDevice ? SCOPES_OF_DEVICE : SCOPES_OF_TRIAL;
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
                        data={data.scope || SCOPE_TRIAL}
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
