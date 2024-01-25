import { useState } from 'react'
import { MapShower } from './MapShower'

import * as React from 'react';
import {
  AppBar, IconButton, Toolbar, Typography, Button, List, ListItemButton, ListItemIcon, ListItemText
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import SendIcon from '@mui/icons-material/Send';
import AddIcon from '@mui/icons-material/Add';
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
            // size="large"
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
          <IconButton
            edge="start"
            color="inherit"
            onClick={() => {
              (async () => {
                const data = { a: 1, b: 'Textual content' };
                const name = prompt('Experiment name');
                const resp = await fetch("http://127.0.0.1:8080/set_experiment/" + name, {
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
              })()
            }}
          >
            <AddIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
      <List>
        {
          experiments.map(e => (
            <ListItemButton key={e.name}>
              <ListItemIcon>
                <SendIcon />
              </ListItemIcon>
              <ListItemText primary={e.name} />
            </ListItemButton>
            // <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            //   {e.name}
            // </Typography>
          ))
        }
      </List>
    </div>
  )
}

export default App
