import { useState } from 'react'
import { MapShower } from './MapShower'

import * as React from 'react';
import {
  AppBar, IconButton, Toolbar, Typography, Button
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { useEffect } from 'react';

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
      {/* <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
      </div> */}
      {/* <MapShower>

      </MapShower> */}
      {/* <ButtonUsage></ButtonUsage> */}
      <AppBar position="static">
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Argos
          </Typography>
          {/* <Button color="inherit">Login</Button> */}
        </Toolbar>
      </AppBar>
      {
        experiments.map(e => (
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            {e.name}
          </Typography>
        ))
      }
    </div>
  )
}

export default App
