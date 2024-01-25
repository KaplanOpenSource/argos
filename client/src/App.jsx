import { useState } from 'react';

import * as React from 'react';
import { Button, List } from '@mui/material';
import { useEffect } from 'react';
import { ExperimentRow } from './ExperimentRow';
import { Header } from './Header';
import dayjs from 'dayjs';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'

function App() {
  const [experiments, setExperiments] = useState([]);

  const getExperimentList = async () => {
    const resp = await fetch("http://127.0.0.1:8080/experiment_list");
    const json = await resp.json();
    setExperiments((json || []).map(x => {
      return { name: x, data: {} };
    }))
  }

  const addExperiment = async () => {
    const name = prompt('Experiment name');
    const data = {
      startDate: dayjs().startOf('day'),
      endDate: dayjs().startOf('day').add(7, 'day'),
      description: ''
    };
    setExperiment(name, data);
  }

  const setExperiment = async (name, data) => {
    const resp = await fetch("http://127.0.0.1:8080/experiment_set/" + name, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });
    const json = await resp.json();
    if ((json || {}).error) {
      alert(json.error);
      return;
    }
    setExperiments(prev => [...prev.filter(p => p.name !== name), { name, data }]);
  }

  useEffect(() => {
    getExperimentList();
  }, [])

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <div
      // style={{top:0, bottom:0, position:'100vfh'}}
      // style={{ height: "100%", width: '100%', position: 'absolute', top: 0, bottom: 0, right: 0 }}
      >
        <Header
          addExperiment={addExperiment}
        />
        <List>
          {
            experiments.map(e => (
              <ExperimentRow key={e.name}
                name={e.name}
                data={e.data}
                setData={newData => setExperiment(e.name, newData)}
              />
            ))
          }
        </List>
        {/* <div id='map'>
        <MapShower>

        </MapShower>
      </div> */}
      </div>
    </LocalizationProvider>
  )
}

export default App
