import {
  AccountTree,
  AccountTreeOutlined,
  Add,
  CloseFullscreen,
  ClosedCaption,
  ClosedCaptionOff,
  OpenInFull,
  Upload
} from '@mui/icons-material';
import EditLocationAltIcon from '@mui/icons-material/EditLocationAlt';
import EditLocationOutlinedIcon from '@mui/icons-material/EditLocationOutlined';
import {
  Stack
} from '@mui/material';
import { useChosenTrial } from '../Context/useChosenTrial';
import { useExperiments } from '../Context/useExperiments';
import { useShowImagePlacement } from '../Context/useShowImagePlacement';
import { DocumentationButton } from '../Doc/DocumentationButton';
import { UploadButton } from '../IO/UploadButton';
import { useUploadExperiment } from '../IO/UploadExperiment';
import { ButtonTooltip } from '../Utils/ButtonTooltip';
import { AppHeaderExpTrial } from './AppHeaderExpTrial';
import { AppHeaderShownMap } from './AppHeaderShownMap';
import { ShowConfigToggles } from './ShowConfigToggles';
import { UndoRedoButtons } from './UndoRedo/UndoRedoButtons';

export const AppHeaderButtons = ({
  fullscreen, setFullscreen,
  showConfig, setShowConfig,
  showAttributes, setShowAttributes,
  showDeviceNames, setShowDeviceNames
}) => {
  const { showImagePlacement, setShowImagePlacement } = useShowImagePlacement();
  const { isExperimentChosen } = useChosenTrial();

  const { addExperiment } = useExperiments();

  const { uploadExperiment } = useUploadExperiment();
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
        <UndoRedoButtons
        />
        {isExperimentChosen()
          ? <>
            <AppHeaderExpTrial
            />
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