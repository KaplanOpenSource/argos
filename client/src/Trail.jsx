import { DateProperty } from "./DateProperty";
import { TreeRow } from "./TreeRow";

export const Trail = ({ name, data, setData }) => {
    return (
        <TreeRow
            key={name}
            name={name}
            data={data}
            setData={setData}
            components={
                <>
                    <DateProperty data={data} setData={setData}
                        label="Created Date"
                        field="createdDate"
                    />
                </>
            }
        >
            {/* {
                (data.trailSet || []).map(e => (
                    <TrailSet
                        key={e.name}
                        name={e.name}
                        data={e.data}
                    />
                ))
            } */}
        </TreeRow>
    )
}
