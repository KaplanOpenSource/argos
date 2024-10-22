import { useContext, useEffect } from "react";
import { experimentContext } from "../Context/ExperimentProvider";
import { ExperimentRow } from "./ExperimentRow";
import { TreeView } from '@mui/x-tree-view/TreeView';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { Paper } from "@mui/material";
import { ButtonTooltip } from "../Utils/ButtonTooltip";
import { DeviceTypesList } from "./DeviceTypesList";
import { SHOW_ALL_EXPERIMENTS, SHOW_DEVICES_TABULAR, SHOW_ONLY_DEVICES, SHOW_ONLY_TRIALS, SHOW_TRIALS_TABULAR } from "../App/ShowConfigToggles";
import { Case, SwitchCase } from "../Utils/SwitchCase";
import { TrialTypesList } from "./TrialTypesList";
import { EnclosingListSelectionContext } from "./EnclosedSelectionProvider";
import { useCloneExperiment } from "../IO/CloneExperiment";
import { ActionsOnMapContext } from "../Map/ActionsOnMapContext";
import { CoordsSpan } from "./CoordsSpan";
import { TrialsTabularView } from "./Tabular/TrialsTabularView";
import { DevicesTabularView } from "./Tabular/DevicesTabularView";
import { ExperimentTreeNodesExpandedContext } from "./ExperimentTreeNodesExpandedProvider";

export const ExperimentList = ({ fullscreen, showConfig, setShowConfig }) => {
    const { experiments, setExperiment, addExperiment, currTrial, setCurrTrial } = useContext(experimentContext);
    const { experiment, experimentName, trialType, trialTypeName, trial, trialName } = currTrial;
    const { cloneExperiment } = useCloneExperiment();
    const { addActionOnMap } = useContext(ActionsOnMapContext);

    const {
        selectionOnEnclosingUuids,
        setSelectionOnEnclosingUuids,
    } = useContext(EnclosingListSelectionContext);

    const {
        expandedNodes,
        setExpandedNodes,
    } = useContext(ExperimentTreeNodesExpandedContext);

    const findExperimentByUuid = (uuid) => {
        if (uuid) {
            return experiments.find(e => e.trackUuid === uuid);
        }
        return undefined;
    }
    const handleNodeToggle = (e, nodeIds) => {
        const newlyExpanded = nodeIds.filter(nodeId => !expandedNodes.includes(nodeId));
        const foundExperiment = findExperimentByUuid(newlyExpanded[0]);
        if (foundExperiment) {
            setCurrTrial({ experimentName: foundExperiment.name });
            const nonExpNodeIds = nodeIds.filter(u => !findExperimentByUuid(u));
            setExpandedNodes([newlyExpanded[0], ...nonExpNodeIds]);
        } else {
            setExpandedNodes(nodeIds);
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
        if (experiment) {
            addActionOnMap((mapObject) => {
                new CoordsSpan().fromExperiment(experiment).fitBounds(mapObject);
            });
        }
    }, [experimentName]);

    useEffect(() => {
        if (experiment && showConfig === SHOW_ONLY_TRIALS) {
            setExpandedNodes(experiment.trialTypes.map(t => t.trackUuid));
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
                expanded={expandedNodes}
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
                    <Case value={SHOW_TRIALS_TABULAR}>
                        <TrialsTabularView
                            data={currTrial.experiment}
                            setData={val => setExperiment(currTrial.experiment.name, val)}
                        />
                    </Case>
                    <Case value={SHOW_DEVICES_TABULAR}>
                        <DevicesTabularView
                            experiment={currTrial.experiment}
                            setExperimentData={val => setExperiment(currTrial.experiment.name, val)}
                        />
                    </Case>
                </SwitchCase>
            </TreeView>
        </Paper>
    )
}