import { useContext, useEffect } from "react";
import { experimentContext } from "../Context/ExperimentProvider";
import { ExperimentRow } from "./ExperimentRow";
import { TreeView } from '@mui/x-tree-view/TreeView';
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
import { sum } from "lodash";

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

    const handleNodeToggle = (_e, nodeIds) => {
        const newlyExpanded = nodeIds.filter(nodeId => !expandedNodes.includes(nodeId));

        const foundExperiment = findExperimentByUuid(newlyExpanded[0]);
        if (foundExperiment) {
            if (experiment?.name !== foundExperiment.name) {
                setCurrTrial({ experimentName: foundExperiment.name });
            }
            const newNodes = [
                foundExperiment.trackUuid,
                ...nodeIds.filter(u => !findExperimentByUuid(u)),
            ];
            if (foundExperiment?.trialTypes?.length < 10) {
                newNodes.push(foundExperiment.trackUuid + '_trialTypes');
            }
            if (sum(foundExperiment?.trialTypes?.map(x => x?.trials?.length || 0)) < 10) {
                newNodes.push(...(foundExperiment?.trialTypes?.map(tt => tt.trackUuid) || []));
            }
            setExpandedNodes(newNodes);
            return;
        }

        if (newlyExpanded[0] === experiment?.trackUuid + '_trialTypes') {
            const trialsNum = sum(experiment?.trialTypes?.map(x => x?.trials?.length || 0));
            if (trialsNum < 10) {
                const trialTypesUuids = experiment?.trialTypes?.map(tt => tt.trackUuid) || [];
                setExpandedNodes([
                    ...nodeIds,
                    ...trialTypesUuids,
                ]);
                return;
            }
        }

        setExpandedNodes(nodeIds);
    };

    useEffect(() => {
        if (experiment) {
            addActionOnMap((mapObject) => {
                new CoordsSpan().fromExperiment(experiment).fitBounds(mapObject);
            });
            if (!expandedNodes.includes(experiment.trackUuid)) {
                handleNodeToggle(undefined, [...expandedNodes, experiment.trackUuid]);
            }
        } else {
            setShowConfig(SHOW_ALL_EXPERIMENTS);
        }
    }, [experimentName]);

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
                expanded={expandedNodes}
                onExpandedItemsChange={handleNodeToggle}
                multiSelect
                selected={selectionOnEnclosingUuids}
                onSelectedItemsChange={(e, ids) => setSelectionOnEnclosingUuids(ids)}
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