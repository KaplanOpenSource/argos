import React from "react";
import { FormControlLabel, IconButton, Switch } from "@mui/material";
import { TreeRow } from "../App/TreeRow";
import { AttributeValue, VALUE_TYPE_SELECT, VALUE_TYPE_DEFAULT, valueTypes } from "./AttributeValue";
import DeleteIcon from '@mui/icons-material/Delete';
import { SelectProperty } from "../Property/SelectProperty";
import { AttributeTypeOptions } from "./AttributeTypeOptions";
import { IAttributeType, IDeviceType, IExperiment, INamed, ITrialType } from "../types/types";
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
    return (
        <TreeRow
            data={data}
            setData={v => {
                console.log(v)
                const { experiment: exp, deviceType, trialType } = containers;
                const experiment = structuredClone(exp as IExperiment);
                if (experiment) {
                    if (deviceType) {
                        const dt = experiment.deviceTypes?.find(x => x.name === deviceType.name);
                        for (const at of dt?.attributeTypes || []) {
                            if (at.name === data.name) {
                                at.name = v.name;
                            }
                        }
                        for (const dv of dt?.devices || []) {
                            for (const at of dv?.attributes || []) {
                                if (at.name === data.name) {
                                    at.name = v.name;
                                }
                            }
                        }
                        for (const tt of experiment.trialTypes || []) {
                            for (const tr of tt?.trials || []) {
                                for (const dv of tr?.devicesOnTrial || []) {
                                    for (const at of dv?.attributes || []) {
                                        if (at.name === data.name) {
                                            at.name = v.name;
                                        }
                                    }
                                }
                            }
                        }
                    }
                    if (trialType) {
                        const tt = experiment.trialTypes?.find(x => x.name === trialType.name);
                        for (const at of tt?.attributeTypes || []) {
                            if (at.name === data.name) {
                                at.name = v.name;
                            }
                        }
                        for (const tr of tt?.trials || []) {
                            for (const at of tr?.attributes || []) {
                                if (at.name === data.name) {
                                    at.name = v.name;
                                }
                            }
                        }
                    }
                    setExperiment(experiment?.name!, experiment);
                }
            }}
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
