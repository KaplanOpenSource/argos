import { CellTower, GridOn, Podcasts, TableView, Terrain } from "@mui/icons-material";
import { ThemeProvider, ToggleButton, ToggleButtonGroup, Tooltip, createTheme } from "@mui/material";
import { useExperimentProvider } from "../Context/ExperimentProvider";

export const SHOW_ALL_EXPERIMENTS = 'SHOW_ALL_EXPERIMENTS';
export const SHOW_ONLY_DEVICES = 'SHOW_ONLY_DEVICES';
export const SHOW_ONLY_TRIALS = 'SHOW_ONLY_TRIALS';
export const SHOW_TRIALS_TABULAR = 'SHOW_TRIALS_TABULAR';
export const SHOW_DEVICES_TABULAR = 'SHOW_DEVICES_TABULAR';

const theme = createTheme({
  palette: {
    primary: { main: '#fefefe' }
  },
});

export const ShowConfigToggles = ({ showConfig, setShowConfig }) => {
  const {
    currTrial,
  } = useExperimentProvider();

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
          value={showConfig}
          exclusive
          onChange={(e, val) => {
            e.stopPropagation();
            setShowConfig(val);
          }}
          disabled={!currTrial.experiment}
        >
          <ToggleButton value={SHOW_ALL_EXPERIMENTS}>
            <Tooltip title="Show all experiments and trials">
              <Terrain />
            </Tooltip>
          </ToggleButton>
          <ToggleButton value={SHOW_ONLY_TRIALS}>
            <Tooltip title="Show only trials of current experiment">
              <GridOn />
            </Tooltip>
          </ToggleButton>
          <ToggleButton value={SHOW_TRIALS_TABULAR}>
            <Tooltip title="Show trials tabular view of current experiment">
              <TableView />
            </Tooltip>
          </ToggleButton>
          <ToggleButton value={SHOW_ONLY_DEVICES}>
            <Tooltip title="Show only devices of current experiment">
              <CellTower />
            </Tooltip>
          </ToggleButton>
          <ToggleButton value={SHOW_DEVICES_TABULAR}>
            <Tooltip title="Show devices tabular view of current trial">
              <Podcasts />
            </Tooltip>
          </ToggleButton>
        </ToggleButtonGroup>
      </Tooltip>
    </ThemeProvider>
  )
}