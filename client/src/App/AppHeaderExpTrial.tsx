import CloseIcon from '@mui/icons-material/Close';
import {
  Stack,
  Tooltip,
  Typography
} from '@mui/material';
import { useState } from 'react';
import { useChosenTrial } from '../Context/useChosenTrial';
import { useExperiments } from '../Context/useExperiments';
import { ButtonTooltip } from '../Utils/ButtonTooltip';
import { IMenuActionItem, MenuActions } from '../Utils/MenuActions';

export const AppHeaderExpTrial = () => {
  const [anchorEl, setAnchorEl] = useState<Element | null>(null);
  const [menuItems, setMenuItems] = useState<IMenuActionItem[]>([]);

  const {
    isExperimentChosen,
    isTrialChosen,
    chooseTrial,
    experiment,
    trialType,
    trial,
  } = useChosenTrial();

  const {
    experiments,
  } = useExperiments();

  const showTrialsMenu = (e: { currentTarget: Element | null; }) => {
    setMenuItems((trialType()?.trials || []).map(tr => {
      return {
        name: tr.name!,
        action: () => chooseTrial({
          experimentName: experiment?.name,
          trialTypeName: trialType()?.name,
          trialName: tr.name
        }),
      };
    }));
    setAnchorEl(e.currentTarget as (Element | null));
  };

  const showExperimentsMenu = (e: { currentTarget: Element | null; }) => {
    setMenuItems(experiments.map(exp => {
      return {
        name: exp.name!,
        action: () => chooseTrial({ experimentName: exp.name }),
      };
    }));
    setAnchorEl(e.currentTarget as (Element | null));
  };

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
            <>
              <Typography variant="body1"
                onClick={showExperimentsMenu}
                style={{ cursor: 'pointer' }}
              >
                {experiment!.name}
              </Typography>
              {isTrialChosen()
                ? <>
                  &nbsp;:&nbsp;
                  <Typography variant="body1">
                    {trialType()!.name}
                  </Typography>
                  &nbsp;:&nbsp;
                  <Typography variant="body1"
                    onClick={showTrialsMenu}
                    style={{ cursor: 'pointer' }}
                  >
                    {trial()!.name}
                  </Typography>
                </>
                : null}
            </>
          </Tooltip>
          <MenuActions
            anchorEl={anchorEl}
            setAnchorEl={setAnchorEl}
            menuItems={menuItems}
          />
        </>
        : null
      }
    </Stack >
  )
}