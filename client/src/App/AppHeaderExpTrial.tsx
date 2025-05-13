import CloseIcon from '@mui/icons-material/Close';
import {
  Stack,
  Tooltip,
  Typography
} from '@mui/material';
import { ButtonTooltip } from '../Utils/ButtonTooltip';
import { useChosenTrial } from '../Context/useChosenTrial';

export const AppHeaderExpTrial = () => {

  const {
    isExperimentChosen,
    isTrialChosen,
    chooseTrial,
    experiment,
    trialType,
    trial,
  } = useChosenTrial();

  return (
    <Stack
      direction='row'
      justifyContent="space-between"
      alignItems="center"
      sx={{ flexGrow: 1 }}
    >
      {isExperimentChosen()
        ? <>
          <ButtonTooltip
            color="inherit"
            onClick={() => {
              chooseTrial({});
            }}
            tooltip={"Stop editing this trial"}
          >
            <CloseIcon />
          </ButtonTooltip>
          <Tooltip
            title="Experiment and trial currently edited"
          >
            <Typography variant="body1">
              {experiment()!.name}
              {isTrialChosen()
                ? <>
                  &nbsp;:&nbsp;
                  {trialType()!.name}
                  &nbsp;:&nbsp;
                  {trial()!.name}
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