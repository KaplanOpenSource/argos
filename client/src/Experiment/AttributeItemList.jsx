import { Tooltip } from "@mui/material";
import { changeByName } from "../Utils/utils";
import { AttributeValue, valueTypeDefault } from "./AttributeValue";
import { SCOPE_EXPERIMENT, SCOPE_TRIAL } from "./AttributeType";

export const AttributeItemList = ({ attributeTypes, data, setData, scope, deviceItem }) => {
    const attributes = (data || {}).attributes || [];

    return (
        <>
            {
                (attributeTypes || []).map(attrType => {
                    const attrTypeScope = attrType.scope || SCOPE_TRIAL;
                    const attr = attributes.find(t => t.name === attrType.name);
                    let value = attrType.defaultValue;
                    if (attr) {
                        value = attr.value;
                    }
                    if (deviceItem) {
                        const attrDev = (deviceItem.attributes || []).find(t => t.name === attrType.name);
                        if (attrDev) {
                            value = attrDev.value;
                        }
                    }
                    const setValue = (val) => {
                        const attrValue = { name: attrType.name, value: val };
                        setData({ ...data, attributes: changeByName(attributes, attrType.name, attrValue) });
                    };
                    const disabled = scope !== attrTypeScope;
                    const tooltipTitle = !disabled ? "" : `${attrType.name} can be updated only on ${attrTypeScope} level (this is the ${scope} level)`;
                    return (
                        <AttributeValue
                            key={attrType.name}
                            label={attrType.name}
                            type={attrType.type || valueTypeDefault}
                            data={value}
                            setData={setValue}
                            attrType={attrType}
                            disabled={disabled}
                            tooltipTitle={tooltipTitle}
                        />
                    )
                })
            }
        </>
    )
}