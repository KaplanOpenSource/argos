import { useState } from 'react';

import * as React from 'react';
import { Button, List } from '@mui/material';
import { useEffect } from 'react';
import { ExperimentRow } from './ExperimentRow';
import { AppHeader } from './AppHeader';
import dayjs from 'dayjs';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'

function App() {
  const [experiments, setExperiments] = useState([]);

  const getExperimentList = async () => {
    const resp = await fetch("http://127.0.0.1:8080/experiment_list");
    const json = await resp.json();
    if ((json || {}).error) {
      alert(json.error);
      return;
    }

    // TODO: reading all the experiments data just to get the dates and so
    // this can be optimized by fetching limited data from the server
    const exp = [];
    for (const name of (json || [])) {
      const resp = await fetch("http://127.0.0.1:8080/experiment/" + name);
      const json = await resp.json();
      if ((json || {}).error) {
        alert(json.error);
        return;
      }
      exp.push({ name, data: json });
    }

    setExperiments(exp);
  }

  const addExperiment = async () => {
    const name = prompt('Experiment name');
    if (name && /^[0-9_a-zA-Z]+$/g.test(name)) {
      const data = {
        startDate: dayjs().startOf('day'),
        endDate: dayjs().startOf('day').add(7, 'day'),
        description: ''
      };
      setExperiment(name, data);
    }
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
        <AppHeader
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
