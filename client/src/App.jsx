import { useState } from 'react';

import * as React from 'react';
import { Button, List } from '@mui/material';
import { useEffect } from 'react';
import { ExperimentRow } from './ExperimentRow';
import { Header } from './Header';

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
    const data = { a: 1, b: 'Textual content' };
    const name = prompt('Experiment name');
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
    setExperiments(prev => [...prev, { name, data }]);
  }

  useEffect(() => {
    getExperimentList();
  }, [])

  return (
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
            />
          ))
        }
      </List>
      {/* <div id='map'>
        <MapShower>

        </MapShower>
      </div> */}
    </div>
  )
}

export default App
