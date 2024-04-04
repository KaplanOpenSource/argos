import { useContext, useEffect, useState } from "react";
import { experimentContext } from "../Context/ExperimentProvider";
import { ExperimentRow } from "./ExperimentRow";
import { TreeView } from '@mui/x-tree-view/TreeView';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import AddIcon from '@mui/icons-material/Add';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { Button, IconButton, Paper, Tooltip, Typography } from "@mui/material";
import { deepClone } from "fast-json-patch";
import { createNewName } from "../Utils/utils";
import { ButtonTooltip } from "../Utils/ButtonTooltip";
import { CloseFullscreen, OpenInFull, Upload } from "@mui/icons-material";
import { uploadExperiment } from "./UploadExperiment";

export const ExperimentList = ({ fullscreen, setFullscreen }) => {
    const { experiments, setExperiment, addExperiment, currTrial } = useContext(experimentContext);

    const [expanded, setExpanded] = useState([]);

    const { experimentName, trialTypeName, trialName } = currTrial;
    useEffect(() => {
        if (trialName) {
            setExpanded([
                experimentName,
                experimentName + "_trialTypes",
                trialTypeName,
                trialTypeName + "_trials",
                experimentName + "_deviceTypes",
                trialName
            ]);
        }
    }, [`${experimentName}:${trialTypeName}:${trialName}`]);

    return (
        <Paper
            style={{
                zIndex: 1000,
                position: 'relative',
                maxWidth: fullscreen ? undefined : 'fit-content',
                width: fullscreen ? '100%' : undefined,
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
                // onClick={() => setShowExperiments(!showExperiments)}
                disableRipple={true}
                disableFocusRipple={true}
                disableTouchRipple={true}
            // style={{ color: "primary" }}
            >
                Experiments
            </Button>
            <ButtonTooltip
                onClick={() => addExperiment()}
                tooltip={"Add experiment"}
            >
                <AddIcon />
            </ButtonTooltip>
            <ButtonTooltip
                onClick={() => uploadExperiment()}
                tooltip={"Upload experiment"}
            >
                <Upload />
            </ButtonTooltip>
            <ButtonTooltip
                onClick={() => {
                    setFullscreen(!fullscreen);
                }}
                tooltip={fullscreen ? "Show experiment list on side" : "Expand experiment list on screen"}
            >
                {fullscreen ? <CloseFullscreen /> : <OpenInFull />}
            </ButtonTooltip>
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
                disableSelection
            >
                {experiments.map(exp => (
                    <ExperimentRow key={exp.name}
                        data={exp}
                        setData={val => setExperiment(exp.name, val)}
                    >
                        <ButtonTooltip
                            tooltip="Clone experiment"
                            onClick={() => {
                                const cloned = deepClone(exp);
                                cloned.name = createNewName(experiments, exp.name + " cloned");
                                addExperiment(cloned);
                            }}
                        >
                            <ContentCopyIcon />
                        </ButtonTooltip>
                    </ExperimentRow>
                ))}
            </TreeView>
        </Paper>
    )
}