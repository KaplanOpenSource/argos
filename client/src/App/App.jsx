import { AppHeader } from './AppHeader';
import { ExperimentList } from '../Experiment/ExperimentList';
import { MapShower } from '../Map/MapShower';
import { DeviceTable } from '../DeviceTable/DeviceTable';
import { Stack } from '@mui/material';
import { MapPlacer } from '../Map/MapPlacer';
import { DeviceMarkersShown } from '../Map/DeviceMarkersShown';
import { MapPositionOnUrl } from '../Map/MapPositionOnUrl';
import { EditToolBox } from '../EditToolBox/EditToolBox';
import { ShapeProvider } from '../EditToolBox/ShapeContext';
import { useContext, useState } from 'react';
import { ActionsOnMapDoer, ActionsOnMapProvider } from '../Map/ActionsOnMapContext';
import { MapCoordinates } from '../Map/MapCoordinates';
import { experimentContext } from '../Context/ExperimentProvider';

export function App() {
  const [showEditBox, setShowEditBox] = useState(false);
  const [markedPoints, setMarkedPoints] = useState([]);
  const [fullscreen, setFullscreen] = useState(false);
  const [showDevicesOnly, setShowDevicesOnly] = useState(false);
  const { currTrial } = useContext(experimentContext);

  return (
    <>
      <AppHeader
        fullscreen={fullscreen}
        setFullscreen={setFullscreen}
        showDevicesOnly={showDevicesOnly}
        setShowDevicesOnly={setShowDevicesOnly}
      />
      <Stack direction={'row'} justifyContent="space-between" alignItems="flex-start">
        <ExperimentList
          fullscreen={fullscreen}
          showDevicesOnly={showDevicesOnly}
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

