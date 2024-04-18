import { useContext, useEffect, useState } from "react";
import { experimentContext } from "../Context/ExperimentProvider";
import { ExperimentRow } from "./ExperimentRow";
import { TreeView } from '@mui/x-tree-view/TreeView';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import AddIcon from '@mui/icons-material/Add';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { Button, Paper } from "@mui/material";
import { deepClone } from "fast-json-patch";
import { createNewName } from "../Utils/utils";
import { ButtonTooltip } from "../Utils/ButtonTooltip";
import { CellTower, CloseFullscreen, OpenInFull } from "@mui/icons-material";
import { UploadExperimentIcon } from "./UploadExperimentIcon";
import { DeviceTypesList } from "./DeviceTypesList";

export const ExperimentList = ({ fullscreen, setFullscreen }) => {
    const { experiments, setExperiment, addExperiment, currTrial } = useContext(experimentContext);

    const [expanded, setExpanded] = useState([]);
    const [showDevicesOnly, setShowDevicesOnly] = useState(false);

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
            <UploadExperimentIcon
            />
            <ButtonTooltip
                onClick={() => {
                    setFullscreen(!fullscreen);
                }}
                tooltip={fullscreen ? "Show experiment list on side" : "Expand experiment list on screen"}
            >
                {fullscreen ? <CloseFullscreen /> : <OpenInFull />}
            </ButtonTooltip>
            <ButtonTooltip
                onClick={() => {
                    setShowDevicesOnly(!showDevicesOnly);
                }}
                tooltip={showDevicesOnly ? "Show all experiments and trials" : "Show only devices of current trial"}
                color={showDevicesOnly ? "primary" : ""}
                disabled={!currTrial.trial}
            >
                <CellTower />
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
                {(showDevicesOnly && currTrial.trial)
                    ? <DeviceTypesList
                        data={currTrial.experiment}
                        setData={val => setExperiment(currTrial.experiment.name, val)}
                    />
                    : experiments.map(exp => (
                        <ExperimentRow key={exp.name}
                            data={exp}
                            setData={val => setExperiment(exp.name, val)}
                            showDevicesOnly={showDevicesOnly && currTrial.trial}
                        >
                            <ButtonTooltip
                                tooltip="Clone experiment"
                                onClick={() => {
                                    const name = createNewName(experiments, exp.name + " cloned");
                                    addExperiment({...deepClone(exp), name});
                                }}
                            >
                                <ContentCopyIcon />
                            </ButtonTooltip>
                        </ExperimentRow>
                    ))
                }
            </TreeView>
        </Paper>
    )
}