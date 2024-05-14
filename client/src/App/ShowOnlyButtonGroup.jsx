import { CellTower } from "@mui/icons-material";
import { ButtonTooltip } from "../Utils/ButtonTooltip";
import { useContext } from "react";
import { experimentContext } from "../Context/ExperimentProvider";

export const ShowOnlyButtonGroup = ({ showDevicesOnly, setShowDevicesOnly }) => {
    const {
        currTrial,
    } = useContext(experimentContext);

    return (
        <ButtonTooltip
            onClick={() => {
                setShowDevicesOnly(!showDevicesOnly);
            }}
            tooltip={!currTrial.experiment
                ? "Choose an experiment to show only its devices"
                : showDevicesOnly
                    ? "Now showing only devices, click to show all experiments and trials"
                    : "Now showing all experiments, click to show only devices of current experiment"}
            color={showDevicesOnly ? "warning" : "inherit"}
            disabled={!currTrial.experiment}
        >
            <CellTower />
        </ButtonTooltip>
    )
}