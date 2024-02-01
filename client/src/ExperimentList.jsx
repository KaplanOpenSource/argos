import { useContext } from "react";
import { experimentContext } from "./ExperimentProvider";
import { ExperimentRow } from "./ExperimentRow";
import { TreeView } from '@mui/x-tree-view/TreeView';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

export const ExperimentList = ({ }) => {
    const { experiments, setExperiment } = useContext(experimentContext);
    
    return (
        <TreeView
            defaultCollapseIcon={<ExpandMoreIcon />}
            defaultExpandIcon={<ChevronRightIcon />}
            sx={{
                // height: 240,
                flexGrow: 1,
                // maxWidth: 400,
                overflowY: 'auto'
            }}
            disableSelection
        >
            {
                experiments.map(e => (
                    <ExperimentRow key={e.name}
                        nameData={e}
                        setNameData={val => setExperiment(e.name, val.data, val.name)}
                    />
                ))
            }
        </TreeView>
    )
}