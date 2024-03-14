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

export const ActionOnMapContext = createContext();

const ActionOnMapDoer = ({ actionsOnMap, setActionsOnMap }) => {
  const mapObject = useMap();
  useEffect(() => {
    if (mapObject && actionsOnMap.length > 0) {
      const act = actionsOnMap[0];
      setActionsOnMap(actionsOnMap.slice(1));
      act(mapObject);
    }
  }, [mapObject, actionsOnMap]);
  return null;
}

export function App() {
  const [showEditBox, setShowEditBox] = useState(false);
  const [markedPoints, setMarkedPoints] = useState([]);

  const [actionsOnMap, setActionsOnMap] = useState([]);
  const addActionOnMap = (newAction) => {
    setActionsOnMap([...actionsOnMap, newAction])
  }

  return (
    <>
      <ActionOnMapContext.Provider value={{ addActionOnMap }}>
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
            <ActionOnMapDoer
              actionsOnMap={actionsOnMap}
              setActionsOnMap={setActionsOnMap}
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
      </ActionOnMapContext.Provider>
    </>
  )
}

