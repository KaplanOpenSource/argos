import { Button } from "@mui/material";
import { DateProperty } from "./DateProperty";
import { TreeRow } from "./TreeRow";
import { experimentContext } from "./ExperimentProvider";
import { useContext } from "react";

export const Trial = ({ data, setData, experimentName, trialTypeName }) => {
    const { setCurrTrial } = useContext(experimentContext);
    return (
        <TreeRow
            key={data.name}
            data={data}
            setData={setData}
            components={
                <>
                    <DateProperty data={data} setData={setData}
                        label="Created Date"
                        field="createdDate"
                    />
                    <Button
                        onClick={() => {
                            setCurrTrial({ experimentName, trialTypeName, trialName: data.name });
                        }}
                    >
                        Edit
                    </Button>
                </>
            }
        >
            {/* {
                (data.trialSet || []).map(e => (
                    <TrialSet
                        key={e.name}
                        name={e.name}
                        data={e.data}
                    />
                ))
            } */}
        </TreeRow>
    )
}
