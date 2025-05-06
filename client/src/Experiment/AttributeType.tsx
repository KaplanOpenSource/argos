import React from "react";
import { FormControlLabel, IconButton, Switch } from "@mui/material";
import { TreeRow } from "../App/TreeRow";
import { AttributeValue, VALUE_TYPE_SELECT, VALUE_TYPE_DEFAULT, valueTypes } from "./AttributeValue";
import DeleteIcon from '@mui/icons-material/Delete';
import { SelectProperty } from "../Property/SelectProperty";
import { AttributeTypeOptions } from "./AttributeTypeOptions";
import { IAttribute, IAttributeType, IExperiment, INamed, ScopeEnum } from "../types/types";
import { useExperiments } from "../Context/useExperiments";
import { remove } from "lodash";
import { TextFieldDebounceOutlined } from "../Utils/TextFieldDebounce";

export const AttributeType = ({
    data,
    setData,
    isOfDevice,
    containers,
}: {
    data: IAttributeType,
    setData: (newData: IAttributeType | undefined) => void,
    isOfDevice: boolean,
    containers: { [obj: string]: INamed | undefined },
}) => {
    const { setExperiment } = useExperiments();

    const getAttributeContainers = (
        clonedExp: IExperiment,
        onTypesArr: (arr: IAttributeType[]) => void,
        onAttrsArr: (arr: IAttribute[]) => void,
    ) => {
        const { deviceType, trialType } = containers;
        if (deviceType) {
            const dt = clonedExp.deviceTypes?.find(x => x.name === deviceType.name);
            onTypesArr(dt?.attributeTypes || []);
            for (const dv of dt?.devices || []) {
                onAttrsArr(dv?.attributes || []);
            }
            for (const tt of clonedExp.trialTypes || []) {
                for (const tr of tt?.trials || []) {
                    for (const dv of tr?.devicesOnTrial || []) {
                        if (dv?.deviceTypeName === deviceType.name) {
                            onAttrsArr(dv?.attributes || []);
                        }
                    }
                }
            }
        }
        if (trialType) {
            const tt = clonedExp.trialTypes?.find(x => x.name === trialType.name);
            onTypesArr(tt?.attributeTypes || []);
            for (const tr of tt?.trials || []) {
                onAttrsArr(tr?.attributes || []);
            }
        }
    }

    const handleRename = (v: INamed) => {
        const experiment = structuredClone(containers.experiment as IExperiment);
        if (experiment) {
            getAttributeContainers(experiment,
                (types) => types.filter(at => at.name === data.name).forEach(at => at.name = v.name),
                (attrs) => attrs.filter(at => at.name === data.name).forEach(at => at.name = v.name),
            );
            setExperiment(experiment?.name!, experiment);
        }
    };

    const handleDelete = () => {
        const experiment = structuredClone(containers.experiment as IExperiment);
        if (experiment) {
            getAttributeContainers(experiment,
                (types) => remove(types, (at) => at.name === data.name),
                (attrs) => remove(attrs, (at) => at.name === data.name),
            );
            setExperiment(experiment?.name!, experiment);
        }
    };

    return (
        <TreeRow
            data={data}
            setData={handleRename}
            components={
                <>
                    <FormControlLabel
                        label="Required"
                        control={
                            <Switch
                                checked={data.required || false}
                                onChange={(e) => setData({ ...data, required: e.target.checked })}
                            />
                        }
                    />
                    <SelectProperty
                        label="Type"
                        data={data.type || VALUE_TYPE_DEFAULT}
                        setData={type => setData({ ...data, type })}
                        options={valueTypes.map(name => { return { name } })}
                    />
                    <SelectProperty
                        label="Scope"
                        data={data.scope === ScopeEnum.SCOPE_EXPERIMENT_ALT ? ScopeEnum.SCOPE_EXPERIMENT : (data.scope || ScopeEnum.SCOPE_TRIAL)}
                        setData={scope => setData({ ...data, scope })}
                        options={isOfDevice
                            ? [
                                { name: ScopeEnum.SCOPE_TRIAL, tooltip: "Attribute can be changed only when device is placed on a trial" },
                                { name: ScopeEnum.SCOPE_EXPERIMENT, tooltip: "Attribute can be changed only on its device definition on the experiment" },
                                { name: ScopeEnum.SCOPE_CONSTANT, tooltip: "Attribute value is always equal to its default" },
                            ]
                            : [
                                { name: ScopeEnum.SCOPE_TRIAL, tooltip: "Attribute can change on each trial" },
                                { name: ScopeEnum.SCOPE_CONSTANT, tooltip: "Attribute value is always equal to its default" },
                            ]}
                        tooltipTitle="Where can this attribute's value be changed"
                    />
                    <IconButton
                        onClick={handleDelete}
                    >
                        <DeleteIcon />
                    </IconButton>
                </>
            }
        >
            {data.type === VALUE_TYPE_SELECT &&
                <AttributeTypeOptions
                    data={data}
                    setData={setData}
                />
            }
            <AttributeValue
                label='Default'
                type={data.type || VALUE_TYPE_DEFAULT}
                data={data.defaultValue}
                setData={val => setData({ ...data, defaultValue: val })}
                attrType={data}
            />
            <TextFieldDebounceOutlined
                label="Description"
                value={data.description}
                onChange={val => setData({ ...data, description: val })}
                multiline={true}
                rows={1}
                sx={{width: '100%'}}
            />
        </TreeRow>
    )
}
