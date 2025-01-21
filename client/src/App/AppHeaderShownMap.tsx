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
        <>
            {shownMapName
                ? <Tooltip title={"Shown map"}>
                    <Stack direction={"row"}>
                        <MapIcon />
                        <Typography variant="body1" paddingRight={1}>
                            {shownMapName}
                        </Typography>
                    </Stack>
                </Tooltip>
                : <Tooltip title={"Real map with embedding"}>
                    <PublicIcon />
                </Tooltip>
            }
        </>
    )
}