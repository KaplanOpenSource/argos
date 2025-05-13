import CloseIcon from '@mui/icons-material/Close';
import {
  Stack,
  Tooltip,
  Typography
} from '@mui/material';
import { ButtonTooltip } from '../Utils/ButtonTooltip';
import { useChosenTrial } from '../Context/useChosenTrial';
import { useState } from 'react';
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
              // onClick={(e) => setAnchorEl(e.currentTarget as (Element | null))}
              >
                {experiment()!.name}
              </Typography>
              {isTrialChosen()
                ? <>
                  &nbsp;:&nbsp;
                  <Typography variant="body1"
                  // onClick={(e) => setAnchorEl(e.currentTarget as (Element | null))}
                  >
                    {trialType()!.name}
                  </Typography>
                  &nbsp;:&nbsp;
                  <Typography variant="body1"
                    onClick={(e) => {
                      setMenuItems((trialType()?.trials || []).map(t => {
                        return {
                          name: t.name!,
                          action: () => chooseTrial({
                            experimentName: experiment()?.name,
                            trialTypeName: trialType()?.name,
                            trialName: t.name
                          }),
                        }
                      }));
                      setAnchorEl(e.currentTarget as (Element | null));
                    }}
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