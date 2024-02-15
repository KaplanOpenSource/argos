import * as React from 'react';
import { AppHeader } from './AppHeader';
import { ExperimentList } from '../Experiment/ExperimentList';
import { MapShower } from '../Map/MapShower';
import { DeviceTable } from '../DeviceTable/DeviceTable';
import { Grid } from '@mui/material';
import { MapClickPlacer } from '../Map/MapClickPlacer';
import { DeviceMarkers } from '../Map/DeviceMarkers';
import { MapPositionOnUrl } from '../Map/MapPositionOnUrl';

export function App() {
  return (
    <>
      <AppHeader
      />
      <Grid container direction={'row'} justifyContent="space-between" alignItems="flex-start">
        <Grid item>
          <ExperimentList
          />
        </Grid>
        <Grid item>
          <DeviceTable
          />
        </Grid>
      </Grid>

      <MapShower
      >
        <MapPositionOnUrl
        />
        <MapClickPlacer
        />
        <DeviceMarkers
        />
      </MapShower>
    </>
  )
}

