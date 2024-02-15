import { Button, IconButton } from "@mui/material";
import { DateProperty } from "../Utils/DateProperty";
import { TreeRow } from "../App/TreeRow";
import { experimentContext } from "../Experiment/ExperimentProvider";
import { useContext } from "react";
import DeleteIcon from '@mui/icons-material/Delete';
import { GridOn } from "@mui/icons-material";

export const Trial = ({ data, setData, experimentName, trialTypeName }) => {
    const { currTrial, setCurrTrial, setShowExperiments } = useContext(experimentContext);
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
                    <IconButton
                        onClick={() => {
                            setCurrTrial({ experimentName, trialTypeName, trialName: data.name });
                            setShowExperiments(false);
                        }}
                    >
                        <GridOn color={data === currTrial.trial ? "primary" : ""} />
                    </IconButton>
                    <IconButton
                        onClick={() => setData(undefined)}
                    >
                        <DeleteIcon />
                    </IconButton>
                </>
            }
        >
        </TreeRow>
    )
}
