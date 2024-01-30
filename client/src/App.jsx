import * as React from 'react';
import { AppHeader } from './AppHeader';
import { ExperimentProvider } from './ExperimentProvider';
import { ExperimentList } from './ExperimentList';

function App() {
  return (
    <ExperimentProvider>

      <div
      // style={{top:0, bottom:0, position:'100vfh'}}
      // style={{ height: "100%", width: '100%', position: 'absolute', top: 0, bottom: 0, right: 0 }}
      >
        <AppHeader
        />
        <ExperimentList
        />
        {/* <div id='map'>
<MapShower>

</MapShower>
</div> */}
      </div>
    </ExperimentProvider>
  )
}

export default App
