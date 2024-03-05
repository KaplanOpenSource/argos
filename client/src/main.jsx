import React from 'react'
import ReactDOM from 'react-dom/client'
import { App } from './App/App'
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { ExperimentProvider } from './Context/ExperimentProvider';

ReactDOM.createRoot(document.getElementById('root')).render(
  <LocalizationProvider dateAdapter={AdapterDayjs}>
    <React.StrictMode>
      <ExperimentProvider>
        <App />
      </ExperimentProvider>
    </React.StrictMode>
  </LocalizationProvider>
)
