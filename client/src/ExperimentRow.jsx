import { TrailType } from "./TrailType";
import { TreeRow } from "./TreeRow";
import { DeviceType } from "./DeviceType";
import { TreeSublist } from "./TreeSublist";
import { DateProperty } from "./DateProperty";

export const ExperimentRow = ({ info, setInfo }) => {
    const { name, data } = info;
    const setData = data => {
        setInfo({ name, data });
    }
    return (
        <TreeRow
            key={name}
            info={info}
            setInfo={setInfo}
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
                fieldName='trailTypes'
                nameTemplate='new_trial_type'
                setData={setData}
                component={(name, data, setData) => (
                    <TrailType
                        key={name}
                        name={name}
                        data={data}
                        setData={setData}
                    />
                )}
            />

            <TreeSublist
                data={data}
                fieldName='deviceTypes'
                nameTemplate='new_device_type'
                setData={setData}
                component={(name, data, setData) => (
                    <DeviceType
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
