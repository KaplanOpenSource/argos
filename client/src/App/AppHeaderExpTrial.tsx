import CloseIcon from '@mui/icons-material/Close';
import {
  Stack,
  Tooltip,
  Typography
} from '@mui/material';
import { useExperimentProvider } from '../Context/ExperimentProvider';
import { useExperiments } from '../Context/useExperiments';
import { ButtonTooltip } from '../Utils/ButtonTooltip';

export const AppHeaderExpTrial = () => {
  const {
    currTrial,
    setCurrTrial,
  } = useExperimentProvider();

  const { addExperiment } = useExperiments();

  const { experimentName, trialTypeName, trialName } = currTrial;
  return (
    <Stack
      direction='row'
      justifyContent="space-between"
      alignItems="center"
      sx={{ flexGrow: 1 }}
    >
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
        </>
        : null
      }
    </Stack >
  )
}