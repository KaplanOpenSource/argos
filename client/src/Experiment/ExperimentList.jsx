import { useContext } from "react";
import { experimentContext } from "./ExperimentProvider";
import { ExperimentRow } from "./ExperimentRow";
import { TreeView } from '@mui/x-tree-view/TreeView';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import AddIcon from '@mui/icons-material/Add';
import { Button, IconButton, Paper, Typography } from "@mui/material";

export const ExperimentList = ({ }) => {
    const { experiments, setExperiment, addExperiment, showExperiments, setShowExperiments } = useContext(experimentContext);

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
            {showExperiments &&
                <TreeView
                    defaultCollapseIcon={<ExpandMoreIcon />}
                    defaultExpandIcon={<ChevronRightIcon />}
                    sx={{
                        height: '80vh',
                        // flexGrow: 1,
                        // maxWidth: 400,
                        overflowY: 'auto',
                    }}
                    // style={{
                    //     zIndex:1000
                    // }}
                    disableSelection
                >
                    {
                        experiments.map(e => (
                            <ExperimentRow key={e.name}
                                data={e}
                                setData={val => setExperiment(e.name, val)}
                            />
                        ))
                    }
                </TreeView>
            }
        </Paper>
    )
}