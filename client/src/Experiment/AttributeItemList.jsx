import { AttributeValue } from "./AttributeValue";
import { AttributeValueGet } from "./AttributeValueGet";

export const AttributeItemList = ({ attributeTypes, data, setData, scope, deviceItem }) => {
    return (
        <>
            {
                (attributeTypes || []).map(attrType => {
                    const {
                        value,
                        setValue,
                        attrTypeScope,
                        attrValueType,
                        editable,
                    } = AttributeValueGet({ attrType, data, setData, deviceItem, scope });
                    const tooltipTitle = editable
                        ? `Attribute "${attrType.name}" can be updated here on ${attrTypeScope} level`
                        : `Attribute "${attrType.name}" can be updated only on ${attrTypeScope} level (this is the ${scope} level)`;
                    return (
                        <AttributeValue
                            key={attrType.name}
                            label={attrType.name}
                            type={attrValueType}
                            data={value}
                            setData={setValue}
                            attrType={attrType}
                            disabled={!editable}
                            tooltipTitle={tooltipTitle}
                        />
                    )
                })
            }
        </>
    )
}