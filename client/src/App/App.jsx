import { AppHeader } from './AppHeader';
import { ExperimentList } from '../Experiment/ExperimentList';
import { MapShower } from '../Map/MapShower';
import { DeviceTable } from '../DeviceTable/DeviceTable';
import { Stack } from '@mui/material';
import { MapPlacer } from '../Map/MapPlacer';
import { DeviceMarkersShown } from '../Map/DeviceMarkersShown';
import { MapPositionOnUrl } from '../Map/MapPositionOnUrl';
import { EditToolBox } from '../EditToolBox/EditToolBox';
import { useContext, useState } from 'react';
import { ActionsOnMapDoer } from '../Map/ActionsOnMapContext';
import { MapCoordinates } from '../Map/MapCoordinates';
import { experimentContext } from '../Context/ExperimentProvider';
import { SHOW_ALL_EXPERIMENTS } from './ShowConfigToggles';

export function App() {
  const [showEditBox, setShowEditBox] = useState(false);
  const [markedPoints, setMarkedPoints] = useState([]);
  const [fullscreen, setFullscreen] = useState(false);
  const [showConfig, setShowConfig] = useState(SHOW_ALL_EXPERIMENTS);
  const { currTrial } = useContext(experimentContext);

  return (
    <>
      <AppHeader
        fullscreen={fullscreen}
        setFullscreen={setFullscreen}
        showConfig={showConfig}
        setShowConfig={setShowConfig}
      />
      <Stack direction={'row'} justifyContent="space-between" alignItems="flex-start">
        <ExperimentList
          fullscreen={fullscreen}
          showConfig={showConfig}
        />
        {fullscreen ? null :
          <DeviceTable
          />
        }
      </Stack>

      <MapShower
      >
        <MapPositionOnUrl
        />
        <MapPlacer
          markedPoints={markedPoints}
          setMarkedPoints={setMarkedPoints}
        />
        <DeviceMarkersShown
        />
        <ActionsOnMapDoer
        />

        <EditToolBox
          // handleSetOne={handleMapClick}
          // handleSetMany={handlePutEntities}
          markedPoints={markedPoints}
          setMarkedPoints={setMarkedPoints}
          showEditBox={showEditBox}
          setShowEditBox={setShowEditBox}
        >
          <MapCoordinates showAsLatLong={!currTrial.shownMapName} />
        </EditToolBox>
      </MapShower>
    </>
  )
}

