import { TreeRow } from "../App/TreeRow";
import { DeviceItem } from "./DeviceItem";
import { TreeSublist } from "../App/TreeSublist";
import { AttributeType } from "./AttributeType";

export const DeviceType = ({ data, setData }) => {
    return (
        <TreeRow
            key={data.name}
            data={data}
            setData={setData}
            components={
                <>
                </>
            }
        >
            <TreeSublist
                parentKey={data.name}
                data={data}
                fieldName='devices'
                nameTemplate='New Device'
                setData={setData}
                component={(data, setData) => (
                    <DeviceItem
                        key={data.name}
                        data={data}
                        setData={setData}
                    />
                )}
            />

            <TreeSublist
                parentKey={data.name}
                data={data}
                fieldName='attributeTypes'
                nameTemplate='New Attribute Type'
                setData={setData}
                component={(data, setData) => (
                    <AttributeType
                        key={data.name}
                        data={data}
                        setData={setData}
                    />
                )}
            />

        </TreeRow>
    )
}