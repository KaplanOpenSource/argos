import { TrailSet } from "./TrailSet";
import { TreeRow } from "./TreeRow";
import { EntityType } from "./EntityType";
import { TreeSublist } from "./TreeSublist";
import { DateProperty } from "./DateProperty";

export const ExperimentRow = ({ name, data, setData }) => {
    return (
        <TreeRow
            key={name}
            name={name}
            data={data}
            setData={setData}
            components={
                <>
                    <DateProperty data={data} setData={setData}
                        label="Start Date"
                        field="startDate"
                    />
                    <DateProperty data={data} setData={setData}
                        label="End Date"
                        field="endDate"
                    />
                </>
            }
        >

            <TreeSublist
                data={data}
                fieldName='trailSet'
                nameTemplate='new_trial_set'
                setData={setData}
                component={(name, data, setData) => (
                    <TrailSet
                        key={name}
                        name={name}
                        data={data}
                        setData={setData}
                    />
                )}
            />

            <TreeSublist
                data={data}
                fieldName='entityTypes'
                nameTemplate='new_entity_type'
                setData={setData}
                component={(name, data, setData) => (
                    <EntityType
                        key={name}
                        name={name}
                        data={data}
                        setData={setData}
                    />
                )}
            />
        </TreeRow>
    )
}
