import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { App } from './App/App';
import { ExperimentProvider } from './Context/ExperimentProvider';
import { ShapeProvider } from './EditToolBox/ShapeContext';
import { ExperimentTreeNodesExpandedProvider } from './Experiment/ExperimentTreeNodesExpandedProvider';
import { ActionsOnMapProvider } from './Map/ActionsOnMapContext';

// consoleErrorUniqueKeyFix();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <LocalizationProvider dateAdapter={AdapterDayjs}>
    <React.StrictMode>
      <ExperimentTreeNodesExpandedProvider>
        <ExperimentProvider>
          <ActionsOnMapProvider>
            <ShapeProvider>
              <App />
            </ShapeProvider>
          </ActionsOnMapProvider>
        </ExperimentProvider>
      </ExperimentTreeNodesExpandedProvider>
    </React.StrictMode>
  </LocalizationProvider>
)
