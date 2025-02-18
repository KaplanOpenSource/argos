import React from "react";
import { useContext } from "react";
import { experimentContext } from "../Context/ExperimentProvider";
import { Tooltip, Stack, Typography } from "@mui/material";
import MapIcon from '@mui/icons-material/Map';
import PublicIcon from '@mui/icons-material/Public';
import { ButtonMenu } from "../Utils/ButtonMenu";
import { IImageStandalone } from "../types/types";
import { useShownMap } from "../Context/useShownMap";

export const AppHeaderShownMap = ({ }) => {
    const { currTrial } = useContext(experimentContext);
    const { shownMapName, experiment } = currTrial;
    const { switchToMap } = useShownMap({});

    const standaloneNames: string[] = (experiment?.imageStandalone || []).map((x: IImageStandalone) => x.name);
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