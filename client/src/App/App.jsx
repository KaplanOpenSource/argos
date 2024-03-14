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
import { createContext, useEffect, useState } from 'react';
import { useMap } from 'react-leaflet';
import { ActionsOnMapDoer, ActionsOnMapProvider } from '../Map/ActionsOnMapContext';

export function App() {
  const [showEditBox, setShowEditBox] = useState(false);
  const [markedPoints, setMarkedPoints] = useState([]);

  return (
    <>
      <ActionsOnMapProvider>
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
            <ActionsOnMapDoer
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
      </ActionsOnMapProvider>
    </>
  )
}

