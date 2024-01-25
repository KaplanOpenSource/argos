import { useState } from 'react';

import * as React from 'react';
import { Button, List } from '@mui/material';
import { useEffect } from 'react';
import { ExperimentRow } from './ExperimentRow';
import { Header } from './Header';

function ButtonUsage() {
  return <Button variant="contained">Hello world</Button>;
}

function App() {
  const [count, setCount] = useState(0)
  const [experiments, setExperiments] = useState([]);

  useEffect(() => {
    (async () => {
      const resp = await fetch("http://127.0.0.1:8080/experiment_names");
      const json = await resp.json();
      setExperiments((json || []).map(x => {
        return { name: x, data: {} };
      }))
    })()
  }, [])

  return (
    <div
    // style={{top:0, bottom:0, position:'100vfh'}}
    // style={{ height: "100%", width: '100%', position: 'absolute', top: 0, bottom: 0, right: 0 }}
    >
      <Header
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
