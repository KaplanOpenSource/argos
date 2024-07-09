import { changeByName } from "../Utils/utils";
import { VALUE_TYPE_DEFAULT } from "./AttributeValue";
import { SCOPE_EXPERIMENT, SCOPE_EXPERIMENT_ALT, SCOPE_TRIAL } from "./AttributeType";

export const AttributeValueGet = ({
    attrType, // Type of the attribute from the container's type
    data, // data of the container (device / trial)
    setData, // set the container
    deviceItem, // device item when applicable
    scope, // scope of the using component 
}) => {
    const attributes = (data || {}).attributes || [];
    const attrTypeScope = attrType.scope === SCOPE_EXPERIMENT_ALT ? SCOPE_EXPERIMENT : (attrType.scope || SCOPE_TRIAL);
    const attr = attributes.find(t => t.name === attrType.name);
    let value = attrType.defaultValue;
    if (attr) {
        value = attr.value;
    }

    // TODO: get value from contained devices also
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

    const attrValueType = attrType.type || VALUE_TYPE_DEFAULT;

    const editable = scope === attrTypeScope;

    return {
        value,
        setValue,
        attrTypeScope,
        attrValueType,
        editable,
    }
}
