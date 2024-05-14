import { useContext, useEffect, useState } from "react";
import { experimentContext } from "../Context/ExperimentProvider";
import { EXPERIMENT_NODE_ID_PREFIX, ExperimentRow } from "./ExperimentRow";
import { TreeView } from '@mui/x-tree-view/TreeView';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { Paper } from "@mui/material";
import { deepClone } from "fast-json-patch";
import { createNewName } from "../Utils/utils";
import { ButtonTooltip } from "../Utils/ButtonTooltip";
import { DeviceTypesList } from "./DeviceTypesList";
import { SHOW_ALL_EXPERIMENTS, SHOW_ONLY_DEVICES, SHOW_ONLY_TRIALS } from "../App/ShowConfigToggles";
import { Case, SwitchCase } from "../Utils/SwitchCase";
import { TrialTypesList } from "./TrialTypesList";

export const ExperimentList = ({ fullscreen, showConfig, setShowConfig }) => {
    const { experiments, setExperiment, addExperiment, currTrial, setCurrTrial } = useContext(experimentContext);
    const { experiment, experimentName, trialTypeName, trialName } = currTrial;
    const [expanded, setExpanded] = useState([]);

    useEffect(() => {
        if (!experiment) {
            setShowConfig(SHOW_ALL_EXPERIMENTS);
            setExpanded(experiments.map(e => EXPERIMENT_NODE_ID_PREFIX + e));
        } else if (trialName) {
            setExpanded([
                EXPERIMENT_NODE_ID_PREFIX + experimentName,
                experimentName + "_trialTypes",
                trialTypeName,
                trialTypeName + "_trials",
                experimentName + "_deviceTypes",
                trialName
            ]);
        }
    }, [experimentName, trialTypeName, trialName]);

    useEffect(() => {
        if (experiment && showConfig === SHOW_ONLY_TRIALS) {
            setExpanded(experiment.trialTypes.map(t => t.name));
        }
    }, [showConfig]);

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
                onNodeToggle={(event, nodeIds) => {
                    const newlyExpanded = nodeIds.filter(nodeId => !expanded.includes(nodeId));
                    if (newlyExpanded.length && newlyExpanded[0].startsWith(EXPERIMENT_NODE_ID_PREFIX)) {
                        setCurrTrial({ experimentName: newlyExpanded[0].split(':')[1] });
                        setExpanded(nodeIds.filter(x => x === newlyExpanded[0] || !x.startsWith(EXPERIMENT_NODE_ID_PREFIX)));
                    } else {
                        setExpanded(nodeIds);
                    }
                }}
                disableSelection
            >
                <SwitchCase test={currTrial.experiment ? showConfig : SHOW_ALL_EXPERIMENTS}>
                    <Case value={SHOW_ALL_EXPERIMENTS}>
                        {experiments.map(exp => (
                            <ExperimentRow key={exp.name}
                                data={exp}
                                setData={val => setExperiment(exp.name, val)}
                                showConfig={showConfig && currTrial.trial}
                            >
                                <ButtonTooltip
                                    tooltip="Clone experiment"
                                    onClick={() => {
                                        const name = createNewName(experiments, exp.name + " cloned");
                                        addExperiment({ ...deepClone(exp), name });
                                    }}
                                >
                                    <ContentCopyIcon />
                                </ButtonTooltip>
                            </ExperimentRow>
                        ))}
                    </Case>
                    <Case value={SHOW_ONLY_DEVICES}>
                        <DeviceTypesList
                            data={currTrial.experiment}
                            setData={val => setExperiment(currTrial.experiment.name, val)}
                        />
                    </Case>
                    <Case value={SHOW_ONLY_TRIALS}>
                        <TrialTypesList
                            data={currTrial.experiment}
                            setData={val => setExperiment(currTrial.experiment.name, val)}
                        />
                    </Case>
                </SwitchCase>
            </TreeView>
        </Paper>
    )
}