import { TreeRow } from "../App/TreeRow";
import { Trial } from "./Trial";
import { TreeSublist } from "../App/TreeSublist";
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
                newDataCreator={() => {
                    return {
                        createdDate: dayjs().startOf('day'),
                    }
                }}
            >
                {
                    (data.trials || []).map(itemData => (
                        <Trial
                            key={itemData.name}
                            data={itemData}
                            setData={newData => {
                                setData({ ...data, trials: changeByName(data.trials, itemData.name, newData) });
                            }}
                            experimentName={experimentName}
                            trialTypeName={data.name}
                        />
                    ))
                }
            </TreeSublist>

            <TreeSublist
                parentKey={data.name}
                data={data}
                fieldName='attributeTypes'
                nameTemplate='New Attribute Type'
                setData={setData}
            >
                {
                    (data.attributeTypes || []).map(itemData => (
                        <AttributeType
                            key={itemData.name}
                            data={itemData}
                            setData={newData => {
                                setData({ ...data, attributeTypes: changeByName(data.attributeTypes, itemData.name, newData) });
                            }}
                        />
                    ))
                }
            </TreeSublist>

        </TreeRow>
    )
}
