import { changeByName } from "../Utils/utils";
import { AttributeValue, valueTypeDefault } from "./AttributeValue";

export const AttributeItemList = ({ attributeTypes, data, setData }) => {
    const attributes = data.attributes || [];

    return (
        <>
            {
                (attributeTypes || []).map(attrType => {
                    const attr = attributes.find(t => t.name === attrType.name);
                    const value = attr ? attr.value : attrType.defaultValue;
                    const setValue = (val) => {
                        const attrValue = { name: attrType.name, value: val };
                        setData({ ...data, attributes: changeByName(attributes, attrType.name, attrValue) });
                    };
                    return (
                        <AttributeValue
                            key={attrType.name}
                            label={attrType.name}
                            type={attrType.type || valueTypeDefault}
                            data={value}
                            setData={setValue}
                            attrType={attrType}
                        />
                    )
                })
            }
        </>
    )
}