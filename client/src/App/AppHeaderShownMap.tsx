import React from "react";
import { useContext } from "react";
import { experimentContext } from "../Context/ExperimentProvider";
import { Tooltip, Stack, Typography } from "@mui/material";
import MapIcon from '@mui/icons-material/Map';
import PublicIcon from '@mui/icons-material/Public';

export const AppHeaderShownMap = ({ }) => {
    const { currTrial } = useContext(experimentContext);
    const { shownMapName } = currTrial;

    return (
        <Tooltip title={shownMapName ? "Shown map" : "Real map with embedding"}>
            <Stack direction={"row"}>
                {shownMapName ? <MapIcon /> : <PublicIcon />}
                {shownMapName && (
                    <Typography variant="body1" paddingRight={1}>
                        {shownMapName}
                    </Typography>
                )}
            </Stack>
        </Tooltip>
    )
}