import { changeByName } from "../Utils/utils";
import { AttributeValue } from "./AttributeValue";

export const AttributeItemList = ({ attributeTypes, data, setData }) => {
    const attributes = data.attributes || [];
    return (
        <>
            {
                (attributeTypes || []).map(attrType => (
                    <AttributeValue
                        key={attrType.name}
                        label={attrType.name}
                        type={attrType.type || 'String'}
                        data={(attributes.find(t => t.name === attrType.name) || { value: '' }).value}
                        setData={newData => {
                            const attrValue = { name: attrType.name, value: newData };
                            setData({ ...data, attributes: changeByName(attributes, attrType.name, attrValue) });
                        }}
                    />
                ))
            }
        </>
    )
}