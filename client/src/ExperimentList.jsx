import { useContext } from "react";
import { experimentContext } from "./ExperimentProvider";
import { ExperimentRow } from "./ExperimentRow";
import { TreeView } from '@mui/x-tree-view/TreeView';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { Paper } from "@mui/material";

export const ExperimentList = ({ }) => {
    const { experiments, setExperiment } = useContext(experimentContext);

    return (
        <Paper
            style={{
                zIndex: 1000,
                position: 'relative',
                // right: '4px',
                // left: '4px',
                top: '-5px',
            }}
        >
            <TreeView
                defaultCollapseIcon={<ExpandMoreIcon />}
                defaultExpandIcon={<ChevronRightIcon />}
                sx={{
                    // height: 240,
                    // flexGrow: 1,
                    // maxWidth: 400,
                    // overflowY: 'auto',
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
        </Paper>
    )
}