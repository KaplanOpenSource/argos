import { useContext, useEffect, useState } from "react";
import { experimentContext } from "./ExperimentProvider";
import { ExperimentRow } from "./ExperimentRow";
import { TreeView } from '@mui/x-tree-view/TreeView';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import AddIcon from '@mui/icons-material/Add';
import { Button, IconButton, Paper, Typography } from "@mui/material";

export const ExperimentList = ({ }) => {
    const { experiments, setExperiment, addExperiment, showExperiments, setShowExperiments, currTrial } = useContext(experimentContext);

    const [expanded, setExpanded] = useState([]);

    useEffect(() => {
        const { experimentName, trialTypeName, trialName } = currTrial;
        if (trialName) {
            setExpanded([experimentName, experimentName + "_trialTypes", trialTypeName, trialTypeName + "_trials", experimentName + "_deviceTypes", trialName]);
        }
    }, [currTrial]);

    return (
        <Paper
            style={{
                zIndex: 1000,
                position: 'relative',
                maxWidth: 'fit-content',
                // maxHeight: '500px',
                // maxWidth: showExperiments ? undefined : 'fit-content',
                // right: showExperiments ? '0px' : undefined,
                left: 0,
                top: '-5px',
                margin: '10px',
                overflowY: 'visible'
            }}
        >
            <Button
                onClick={() => setShowExperiments(!showExperiments)}
            >
                Experiments
            </Button>
            <IconButton
                edge="start"
                color="inherit"
                onClick={() => {
                    addExperiment();
                    setShowExperiments(true);
                }}
            >
                <AddIcon />
            </IconButton>
            <TreeView
                defaultCollapseIcon={<ExpandMoreIcon />}
                defaultExpandIcon={<ChevronRightIcon />}
                sx={{
                    height: '80vh',
                    // flexGrow: 1,
                    // maxWidth: 400,
                    overflowY: 'auto',
                }}
                expanded={expanded}
                onNodeToggle={(event, nodeIds) => setExpanded(nodeIds)}
                // style={{
                //     zIndex:1000
                // }}
                disableSelection
            >
                {((showExperiments || !currTrial.experiment) ? experiments : [currTrial.experiment]).map(e => (
                    <ExperimentRow key={e.name}
                        data={e}
                        setData={val => setExperiment(e.name, val)}
                    />
                ))}
            </TreeView>
        </Paper>
    )
}