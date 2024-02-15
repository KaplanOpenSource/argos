import { Button, IconButton } from "@mui/material";
import { DateProperty } from "../Utils/DateProperty";
import { TreeRow } from "../App/TreeRow";
import { experimentContext } from "../Experiment/ExperimentProvider";
import { useContext } from "react";
import DeleteIcon from '@mui/icons-material/Delete';

export const Trial = ({ data, setData, experimentName, trialTypeName }) => {
    const { setCurrTrial, setShowExperiments } = useContext(experimentContext);
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
                            setShowExperiments(false);
                        }}
                    >
                        Edit
                    </Button>
                    <IconButton
                        onClick={() => setData(undefined)}
                    >
                        <DeleteIcon />
                    </IconButton>
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
