import React from "react";
import { FormControlLabel, IconButton, Switch } from "@mui/material";
import { TreeRow } from "../App/TreeRow";
import { AttributeValue, VALUE_TYPE_SELECT, VALUE_TYPE_DEFAULT, valueTypes } from "./AttributeValue";
import DeleteIcon from '@mui/icons-material/Delete';
import { SelectProperty } from "../Property/SelectProperty";
import { AttributeTypeOptions } from "./AttributeTypeOptions";
import { IAttribute, IAttributeType, IDeviceType, IExperiment, INamed, ITrialType } from "../types/types";
import { useExperiments } from "../Context/useExperiments";

export const SCOPE_TRIAL = "Trial";
export const SCOPE_EXPERIMENT = "Device definition";
export const SCOPE_EXPERIMENT_ALT = "Experiment" // legacy;
export const SCOPE_CONSTANT = "Constant";

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

    const getAttributeContainers = (clonedExp: IExperiment) => {
        const { deviceType, trialType } = containers;
        let attributeTypes: IAttributeType[] = [];
        let attributes: IAttribute[] = [];
        if (deviceType) {
            const dt = clonedExp.deviceTypes?.find(x => x.name === deviceType.name);
            attributeTypes = dt?.attributeTypes || [];
            for (const dv of dt?.devices || []) {
                attributes.push(...(dv?.attributes || []));
            }
            for (const tt of clonedExp.trialTypes || []) {
                for (const tr of tt?.trials || []) {
                    for (const dv of tr?.devicesOnTrial || []) {
                        if (dv?.deviceTypeName === deviceType.name) {
                            attributes.push(...(dv?.attributes || []));
                        }
                    }
                }
            }
        }
        if (trialType) {
            const tt = clonedExp.trialTypes?.find(x => x.name === trialType.name);
            attributeTypes = tt?.attributeTypes || [];
            for (const tr of tt?.trials || []) {
                attributes.push(...(tr?.attributes || []));
            }
        }
        return { attributeTypes, attributes };
    }
    
    const handleRename = (v: INamed) => {
        const experiment = structuredClone(containers.experiment as IExperiment);
        if (experiment) {
            const { attributeTypes, attributes } = getAttributeContainers(experiment);
            for (const at of attributeTypes) {
                if (at.name === data.name) {
                    at.name = v.name;
                }
            }
            for (const at of attributes) {
                if (at.name === data.name) {
                    at.name = v.name;
                }
            }
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
        </TreeRow>
    )
}
