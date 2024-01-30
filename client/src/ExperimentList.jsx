import { useContext } from "react";
import { experimentContext } from "./ExperimentProvider";
import { ExperimentRow } from "./ExperimentRow";
import { List } from "@mui/material";

export const ExperimentList = ({ }) => {
    const { experiments, setExperiment } = useContext(experimentContext);
    return (
        <List>
            {
                experiments.map(e => (
                    <ExperimentRow key={e.name}
                        name={e.name}
                        data={e.data}
                        setData={newData => setExperiment(e.name, newData)}
                    />
                ))
            }
        </List>
    )
}