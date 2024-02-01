import { TreeRow } from "./TreeRow";
import { Trial } from "./Trial";
import { TreeSublist } from "./TreeSublist";
import { AttributeType } from "./AttributeType";
import dayjs from "dayjs";

export const TrialType = ({ data, setData }) => {
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
                data={data}
                fieldName='trials'
                nameTemplate='New Trial'
                setData={setData}
                component={(data, setData) => (
                    <Trial
                        key={data.name}
                        data={data}
                        setData={setData}
                    />
                )}
                newDataCreator={() => {
                    return {
                        createdDate: dayjs().startOf('day'),
                    }
                }}
            />

            <TreeSublist
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
