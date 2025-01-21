import CloseIcon from '@mui/icons-material/Close';
import {
    Stack,
    Tooltip,
    Typography
} from '@mui/material';
import { experimentContext } from '../Context/ExperimentProvider';
import { useContext } from 'react';
import {
    AccountTree,
    AccountTreeOutlined,
    Add,
    CloseFullscreen,
    ClosedCaption,
    ClosedCaptionOff,
    OpenInFull,
    Redo,
    Undo,
    Upload
} from '@mui/icons-material';
import EditLocationAltIcon from '@mui/icons-material/EditLocationAlt';
import EditLocationOutlinedIcon from '@mui/icons-material/EditLocationOutlined';
import { ButtonTooltip } from '../Utils/ButtonTooltip';
import { ShowConfigToggles } from './ShowConfigToggles';
import { UploadButton } from '../IO/UploadButton';
import { useUploadExperiment } from '../IO/UploadExperiment';
import { DocumentationButton } from '../Doc/DocumentationButton';
import { AppHeaderShownMap } from './AppHeaderShownMap';

export const AppHeaderButtons = ({
    fullscreen, setFullscreen,
    showConfig, setShowConfig,
    showAttributes, setShowAttributes,
    showDeviceNames, setShowDeviceNames
}) => {
    const {
        undoOperation,
        redoOperation,
        undoPossible,
        redoPossible,
        currTrial,
        setCurrTrial,
        showImagePlacement,
        setShowImagePlacement,
        addExperiment,
    } = useContext(experimentContext);
    const { uploadExperiment } = useUploadExperiment();
    const { experimentName, trialTypeName, trialName } = currTrial;
    return (
        <Stack
            direction='row'
            justifyContent="space-between"
            alignItems="center"
            sx={{ flexGrow: 1 }}
        >
            <Stack direction='row'
                justifyContent="flex-start"
                alignItems="center"
            >
                <DocumentationButton />
                <ButtonTooltip
                    color="inherit"
                    onClick={() => addExperiment()}
                    tooltip={"Add experiment"}
                >
                    <Add />
                </ButtonTooltip>
                <UploadButton
                    accept=".json,.zip"
                    tooltip={"Upload experiment"}
                    uploadFunc={(file) => uploadExperiment(file)}
                >
                    <Upload />
                </UploadButton>
                <ButtonTooltip
                    onClick={() => setFullscreen(!fullscreen)}
                    tooltip={fullscreen ? "Show experiment list on side" : "Expand experiment list on screen"}
                    color="inherit"
                >
                    {fullscreen ? <CloseFullscreen /> : <OpenInFull />}
                </ButtonTooltip>
                <ShowConfigToggles
                    showConfig={showConfig}
                    setShowConfig={setShowConfig}
                />
                <ButtonTooltip
                    tooltip={showAttributes ? "Hide attributes on selected devices" : "Show attributes on selected devices"}
                    onClick={() => setShowAttributes(!showAttributes)}
                    color="inherit"
                >
                    {showAttributes ? <AccountTree /> : <AccountTreeOutlined />}
                </ButtonTooltip>
                <ButtonTooltip
                    tooltip={showDeviceNames ? "Hide Names of devices" : "Show Names of devices"}
                    onClick={() => setShowDeviceNames(!showDeviceNames)}
                    color="inherit"
                >
                    {showDeviceNames ? <ClosedCaption /> : <ClosedCaptionOff />}
                </ButtonTooltip>
            </Stack>
            <Stack
                direction='row'
                justifyContent="flex-end"
                alignItems="center"
            >
                <ButtonTooltip
                    color="inherit"
                    // sx={{ mr: 2 }}
                    onClick={() => undoOperation()}
                    tooltip={"Undo"}
                    disabled={!undoPossible}
                >
                    <Undo />
                </ButtonTooltip>
                <ButtonTooltip
                    color="inherit"
                    // sx={{ mr: 2 }}
                    onClick={() => redoOperation()}
                    tooltip={"Redo"}
                    disabled={!redoPossible}
                >
                    <Redo />
                </ButtonTooltip>
                {experimentName
                    ? <>
                        <ButtonTooltip
                            color="inherit"
                            onClick={() => {
                                setCurrTrial({});
                            }}
                            tooltip={"Stop editing this trial"}
                        >
                            <CloseIcon />
                        </ButtonTooltip>
                        <Tooltip
                            title="Experiment and trial currently edited"
                        >
                            <Typography variant="body1">
                                {experimentName}
                                {trialName
                                    ? <>
                                        &nbsp;:&nbsp;
                                        {trialTypeName}
                                        &nbsp;:&nbsp;
                                        {trialName}
                                    </>
                                    : null}
                            </Typography>
                        </Tooltip>
                        <AppHeaderShownMap
                        />
                        <ButtonTooltip
                            color='inherit'
                            onClick={() => setShowImagePlacement(!showImagePlacement)}
                            tooltip="Edit image placement"
                        >
                            {showImagePlacement
                                ? <EditLocationAltIcon />
                                : <EditLocationOutlinedIcon />
                            }
                        </ButtonTooltip>
                    </>
                    : null
                }
            </Stack>
        </Stack>
    )
}