import { TreeRow } from "./TreeRow";
import { Trial } from "./Trial";
import { TreeSublist } from "./TreeSublist";
import { AttributeType } from "./AttributeType";
import dayjs from "dayjs";

export const TrialType = ({ data, setData, experimentName }) => {
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
                fieldName='trials'
                nameTemplate='New Trial'
                setData={setData}
                component={(data1, setData1) => (
                    <Trial
                        key={data1.name}
                        data={data1}
                        setData={setData1}
                        experimentName={experimentName}
                        trialTypeName={data.name}
                    />
                )}
                newDataCreator={() => {
                    return {
                        createdDate: dayjs().startOf('day'),
                    }
                }}
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
