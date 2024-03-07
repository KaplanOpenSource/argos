import { AppHeader } from './AppHeader';
import { ExperimentList } from '../Experiment/ExperimentList';
import { MapShower } from '../Map/MapShower';
import { DeviceTable } from '../DeviceTable/DeviceTable';
import { Grid } from '@mui/material';
import { MapPlacer } from '../Map/MapPlacer';
import { DeviceMarkers } from '../Map/DeviceMarkers';
import { MapPositionOnUrl } from '../Map/MapPositionOnUrl';
import { EditToolBox } from '../EditToolBox/EditToolBox';
import { ShapeProvider } from '../EditToolBox/ShapeContext';
import { useState } from 'react';

export function App() {
  const [showEditBox, setShowEditBox] = useState(false);
  const [markedPoints, setMarkedPoints] = useState([]);

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

      <ShapeProvider>
        <MapShower
        >
          <MapPositionOnUrl
          />
          <MapPlacer
            markedPoints={markedPoints}
            setMarkedPoints={setMarkedPoints}
          />
          <DeviceMarkers
          />
        </MapShower>

        <EditToolBox
          // handleSetOne={handleMapClick}
          // handleSetMany={handlePutEntities}
          markedPoints={markedPoints}
          setMarkedPoints={setMarkedPoints}
          showEditBox={showEditBox}
          setShowEditBox={setShowEditBox}
        ></EditToolBox>
      </ShapeProvider>
    </>
  )
}

