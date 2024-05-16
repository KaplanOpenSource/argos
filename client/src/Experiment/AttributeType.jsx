import { FormControlLabel, IconButton, Switch } from "@mui/material";
import { TreeRow } from "../App/TreeRow";
import { AttributeValue, VALUE_TYPE_SELECT, valueTypeDefault, valueTypes } from "./AttributeValue";
import DeleteIcon from '@mui/icons-material/Delete';
import { TreeSublist } from "../App/TreeSublist";
import { BooleanProperty } from "../Utils/BooleanProperty";
import { SelectProperty } from "../Utils/SelectProperty";

export const SCOPE_TRIAL = "Trial";
export const SCOPE_EXPERIMENT = "Device definition";
export const SCOPE_EXPERIMENT_ALT = "Experiment" // legacy;
export const SCOPE_CONSTANT = "Constant";
export const AttributeType = ({ data, setData, isOfDevice }) => {
    return (
        <TreeRow
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
                        data={data.scope === SCOPE_EXPERIMENT_ALT ? SCOPE_EXPERIMENT : (data.scope || SCOPE_TRIAL)}
                        setData={scope => setData({ ...data, scope })}
                        options={isOfDevice
                            ? [
                                { name: SCOPE_TRIAL, tooltip: "Attribute can be changed only when device is placed on a trial" },
                                { name: SCOPE_EXPERIMENT, tooltip: "Attribute can be changed only on its device definition on the experiment" },
                                { name: SCOPE_CONSTANT, tooltip: "Attribute value is always equal to its default" },
                            ]
                            : [
                                { name: SCOPE_TRIAL, tooltip: "Attribute can change on each trial" },
                                { name: SCOPE_CONSTANT, tooltip: "Attribute value is always equal to its default" },
                            ]}
                        tooltipTitle="Where can this attribute's value be changed"
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
