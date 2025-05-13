import MapIcon from '@mui/icons-material/Map';
import PublicIcon from '@mui/icons-material/Public';
import { Stack, Tooltip, Typography } from "@mui/material";
import { useState } from "react";
import { useExperimentProvider } from "../Context/ExperimentProvider";
import { useShownMap } from "../Context/useShownMap";
import { IImageStandalone } from "../types/types";
import { ButtonTooltip } from '../Utils/ButtonTooltip';
import { MenuActions } from '../Utils/MenuActions';

export const AppHeaderShownMap = ({ }) => {
  const { currTrial } = useExperimentProvider();
  const { shownMapName, experiment } = currTrial;
  const { switchToMap } = useShownMap({});
  const [anchorEl, setAnchorEl] = useState<Element | null>(null);

  const standaloneNames: string[] = (experiment?.imageStandalone || []).map((x: IImageStandalone) => x.name!);
  const menuItems = standaloneNames.map(name => ({
    name,
    action: () => switchToMap(name)
  }));

  const realMapText = "Real map with embedding";
  menuItems.push({
    name: realMapText,
    action: () => switchToMap(undefined)
  });

  return (
    <Stack
      direction={"row"}
      justifyContent="flex-end"
      alignItems="center"
    >
      <ButtonTooltip
        tooltip={(shownMapName ? "Shown map" : realMapText) + ", click to change"}
        color={'inherit'}
        onClick={(e: MouseEvent) => setAnchorEl(e.currentTarget as (Element | null))}
      >
        {shownMapName ? <MapIcon /> : <PublicIcon />}
      </ButtonTooltip>
      {shownMapName && (
        <Tooltip title={"Name of the map shown, click to change map"}>
          <Typography variant="body1" paddingRight={1}
            onClick={(e) => setAnchorEl(e.currentTarget as (Element | null))}
            style={{ cursor: 'pointer' }}
          >
            {shownMapName}
          </Typography>
        </Tooltip>
      )}
      <MenuActions
        anchorEl={anchorEl}
        setAnchorEl={setAnchorEl}
        menuItems={menuItems}
      />
    </Stack>
  )
}