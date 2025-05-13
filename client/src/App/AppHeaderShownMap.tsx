import MapIcon from '@mui/icons-material/Map';
import PublicIcon from '@mui/icons-material/Public';
import { Stack, Tooltip, Typography } from "@mui/material";
import React from "react";
import { useExperimentProvider } from "../Context/ExperimentProvider";
import { useShownMap } from "../Context/useShownMap";
import { ButtonMenu } from "../Utils/ButtonMenu";
import { IImageStandalone } from "../types/types";

export const AppHeaderShownMap = ({ }) => {
  const { currTrial } = useExperimentProvider();
  const { shownMapName, experiment } = currTrial;
  const { switchToMap } = useShownMap({});

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
      <ButtonMenu
        tooltip={(shownMapName ? "Shown map" : realMapText) + ", click to change"}
        color={'inherit'}
        menuItems={menuItems}
      >
        {shownMapName ? <MapIcon /> : <PublicIcon />}
      </ButtonMenu>
      {shownMapName && (
        <Tooltip title={"Name of the map shown"}>
          <Typography variant="body1" paddingRight={1}>
            {shownMapName}
          </Typography>
        </Tooltip>
      )}
    </Stack>
  )
}