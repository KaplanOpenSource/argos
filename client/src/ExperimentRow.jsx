import { TrialType } from "./TrialType";
import { TreeRow } from "./TreeRow";
import { DeviceType } from "./DeviceType";
import { TreeSublist } from "./TreeSublist";
import { DateProperty } from "./DateProperty";

export const ExperimentRow = ({ nameData, setNameData }) => {
    const { name, data } = nameData;
    const setData = data => {
        setNameData({ name, data });
    }
    return (
        <TreeRow
            key={name}
            nameData={nameData}
            setNameData={setNameData}
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
                fieldName='trialTypes'
                nameTemplate='new_trial_type'
                setData={setData}
                component={(name, data, setData) => (
                    <TrialType
                        key={name}
                        name={name}
                        data={data}
                        setData={setData}
                    />
                )}
            />

            {/* <TreeSublist
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
            /> */}
        </TreeRow>
    )
}
