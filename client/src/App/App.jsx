import * as React from 'react';
import { AppHeader } from './AppHeader';
import { ExperimentProvider } from '../Experiment/ExperimentProvider';
import { ExperimentList } from '../Experiment/ExperimentList';
import { MapShower } from '../Map/MapShower';
import { useState } from 'react';
import { DevicePlanner } from '../Map/DevicePlanner';

export function App() {
  return (
    <ExperimentProvider>

      {/* <div
      // style={{top:0, bottom:0, position:'100vfh'}}
      // style={{ height: "100%", width: '100%', position: 'absolute', top: 0, bottom: 0, right: 0 }}
      > */}
      <AppHeader
      // style={{ height: 100 }}
      />
      <ExperimentList
      />
      <DevicePlanner
      />
      <MapShower
      // style={{ height: '100px' }}
      >

      </MapShower>
      {/* </div> */}
    </ExperimentProvider>
  )
}

