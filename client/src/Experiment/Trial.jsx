import { Button, IconButton } from "@mui/material";
import { DateProperty } from "../Utils/DateProperty";
import { TreeRow } from "../App/TreeRow";
import { experimentContext } from "../Context/ExperimentProvider";
import { useContext } from "react";
import DeleteIcon from '@mui/icons-material/Delete';
import { GridOn } from "@mui/icons-material";
import { AttributeItemList } from "./AttributeItemList";

export const Trial = ({ data, setData, experiment, trialType }) => {
    const { currTrial, setCurrTrial, setShowExperiments, experiments } = useContext(experimentContext);
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
                            setCurrTrial({ experimentName: experiment.name, trialTypeName: trialType.name, trialName: data.name });
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
            <AttributeItemList
                attributeTypes={trialType.attributeTypes}
                data={data}
                setData={setData}
            />
        </TreeRow>
    )
}
