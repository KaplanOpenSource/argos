import { useContext, useEffect, useState } from "react";
import { experimentContext } from "../Context/ExperimentProvider";
import { ExperimentRow } from "./ExperimentRow";
import { TreeView } from '@mui/x-tree-view/TreeView';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { Paper } from "@mui/material";
import { ButtonTooltip } from "../Utils/ButtonTooltip";
import { DeviceTypesList } from "./DeviceTypesList";
import { SHOW_ALL_EXPERIMENTS, SHOW_ONLY_DEVICES, SHOW_ONLY_TRIALS } from "../App/ShowConfigToggles";
import { Case, SwitchCase } from "../Utils/SwitchCase";
import { TrialTypesList } from "./TrialTypesList";
import { EnclosingListSelectionContext } from "./EnclosedSelectionProvider";
import { useCloneExperiment } from "../IO/CloneExperiment";

export const ExperimentList = ({ fullscreen, showConfig, setShowConfig }) => {
    const { experiments, setExperiment, addExperiment, currTrial, setCurrTrial } = useContext(experimentContext);
    const { experiment, experimentName, trialType, trialTypeName, trial, trialName } = currTrial;
    const { cloneExperiment } = useCloneExperiment();

    const [expanded, setExpanded] = useState([]);

    const {
        selectionOnEnclosingUuids,
        setSelectionOnEnclosingUuids,
    } = useContext(EnclosingListSelectionContext);

    const findExperimentByUuid = (uuid) => {
        if (uuid) {
            return experiments.find(e => e.trackUuid === uuid);
        }
        return undefined;
    }
    const handleNodeToggle = (e, nodeIds) => {
        const newlyExpanded = nodeIds.filter(nodeId => !expanded.includes(nodeId));
        const foundExperiment = findExperimentByUuid(newlyExpanded[0]);
        if (foundExperiment) {
            setCurrTrial({ experimentName: foundExperiment.name });
            const nonExpNodeIds = nodeIds.filter(u => !findExperimentByUuid(u));
            setExpanded([newlyExpanded[0], ...nonExpNodeIds]);
        } else {
            setExpanded(nodeIds);
        }
    };

    useEffect(() => {
        if (!experiment) {
            setShowConfig(SHOW_ALL_EXPERIMENTS);
            // setExpanded(experiments.map(e => EXPERIMENT_NODE_ID_PREFIX + e));
        // } else if (trialName) {
        //     setExpanded([
        //         experiment.trackUuid,
        //         experimentName + "_trialTypes",
        //         trialType.trackUuid,
        //         experimentName + "_deviceTypes",
        //         trial.trackUuid,
        //     ]);
        }
    }, [experimentName, trialTypeName, trialName]);

    useEffect(() => {
        if (experiment && showConfig === SHOW_ONLY_TRIALS) {
            setExpanded(experiment.trialTypes.map(t => t.trackUuid));
        }
    }, [showConfig]);

    return (
        <Paper
            style={{
                zIndex: 1000,
                position: 'relative',
                maxWidth: fullscreen ? undefined : 'fit-content',
                width: fullscreen ? '100%' : undefined,
                left: 0,
                top: '-5px',
                margin: '10px',
                maxHeight: '80vh',
                overflowY: 'auto',
                pointerEvents: 'all',
            }}
        >
            <TreeView
                defaultCollapseIcon={<ExpandMoreIcon />}
                defaultExpandIcon={<ChevronRightIcon />}
                expanded={expanded}
                onNodeToggle={handleNodeToggle}
                multiSelect
                selected={selectionOnEnclosingUuids}
                onNodeSelect={(e, ids) => setSelectionOnEnclosingUuids(ids)}
            >
                <SwitchCase test={currTrial.experiment ? showConfig : SHOW_ALL_EXPERIMENTS}>
                    <Case value={SHOW_ALL_EXPERIMENTS}>
                        {experiments?.map(exp => (
                            <ExperimentRow
                                key={exp.trackUuid || Math.random() + ""}
                                data={exp}
                                setData={val => setExperiment(exp.name, val)}
                                showConfig={showConfig && currTrial.trial}
                            >
                                <ButtonTooltip
                                    tooltip="Clone experiment"
                                    onClick={() => cloneExperiment(exp)}
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