import { CellTower, Terrain } from "@mui/icons-material";
import { useContext } from "react";
import { experimentContext } from "../Context/ExperimentProvider";
import { ThemeProvider, ToggleButton, ToggleButtonGroup, Tooltip, createTheme } from "@mui/material";

const theme = createTheme({
    palette: {
        primary: { main: '#fefefe' }
    },
});

export const ShowOnlyButtonGroup = ({ showDevicesOnly, setShowDevicesOnly }) => {
    const {
        currTrial,
    } = useContext(experimentContext);

    return (
        <ThemeProvider theme={theme}>
            <Tooltip
                title={currTrial.experiment
                    ? ""
                    : "Choose an experiment to customize which parts of the experiment are shown"}
            >
                <ToggleButtonGroup
                    color="primary"
                    size="small"
                    value={showDevicesOnly}
                    exclusive
                    onChange={(e, val) => {
                        e.stopPropagation();
                        setShowDevicesOnly(val);
                    }}
                    disabled={!currTrial.experiment}
                >
                    <ToggleButton value={false}>
                        <Tooltip title="Show all experiments and trials">
                            <Terrain />
                        </Tooltip>
                    </ToggleButton>
                    <ToggleButton value={true}>
                        <Tooltip title="Show only devices of current experiment">
                            <CellTower />
                        </Tooltip>
                    </ToggleButton>
                </ToggleButtonGroup>
            </Tooltip>
        </ThemeProvider>
    )
}