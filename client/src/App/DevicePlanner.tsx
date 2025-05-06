import { Stack } from '@mui/material';
import React, { useState } from 'react';
import { AllExperimentsLoader } from '../Context/AllExperimentsLoader';
import { ChosenTrialOnUrl } from '../Context/ChosenTrialOnUrl';
import { useExperimentProvider } from '../Context/ExperimentProvider';
import { CurrMouseLocation } from '../Context/useCurrMouseLocation';
import { ServerUpdatesHandler } from '../Context/useServerUpdates';
import { DeviceTable } from '../DeviceTable/DeviceTable';
import { EditToolBox } from '../EditToolBox/EditToolBox';
import { EnclosingListSelectionProvider } from '../Experiment/EnclosedSelectionProvider';
import { ExperimentList } from '../Experiment/ExperimentList';
import { ActionsOnMapDoer } from '../Map/ActionsOnMapContext';
import { DeviceMarkersShown } from '../Map/Device/DeviceMarkersShown';
import { MapCoordinates } from '../Map/MapCoordinates';
import { MapPlacer } from '../Map/MapPlacer';
import { MapPositionOnUrl } from '../Map/MapPositionOnUrl';
import { MapShower } from '../Map/MapShower';
import { MapDrawExperiment } from '../MapDraw/MapDrawExperiment';
import { AppHeader } from './AppHeader';
import { AppHeaderButtons } from './AppHeaderButtons';
import { SHOW_ALL_EXPERIMENTS } from './ShowConfigToggles';
import { UndoRedoHandler } from './UndoRedo/useUndoRedo';

export function DevicePlanner() {
  const [showEditBox, setShowEditBox] = useState(false);
  const [markedPoints, setMarkedPoints] = useState([]);
  const [fullscreen, setFullscreen] = useState(false);
  const [showConfig, setShowConfig] = useState(SHOW_ALL_EXPERIMENTS);
  const [showAttributes, setShowAttributes] = useState(false);
  const [showDeviceNames, setShowDeviceNames] = useState(true);
  const { currTrial } = useExperimentProvider();

  return (
    <>
      <AllExperimentsLoader />
      <ServerUpdatesHandler />
      <UndoRedoHandler />
      <ChosenTrialOnUrl />
      <AppHeader>
        <AppHeaderButtons
          fullscreen={fullscreen} setFullscreen={setFullscreen}
          showConfig={showConfig} setShowConfig={setShowConfig}
          showAttributes={showAttributes} setShowAttributes={setShowAttributes}
          showDeviceNames={showDeviceNames} setShowDeviceNames={setShowDeviceNames}
        />
      </AppHeader>
      <Stack
        direction={'row'}
        justifyContent="space-between"
        alignItems="flex-start"
        style={{
          pointerEvents: 'none',
        }}
      >
        <EnclosingListSelectionProvider>
          <ExperimentList
            fullscreen={fullscreen}
            showConfig={showConfig}
            setShowConfig={setShowConfig}
          />
        </EnclosingListSelectionProvider>
        {fullscreen ? null :
          <EnclosingListSelectionProvider>
            <DeviceTable
              showAttributes={showAttributes}
              setShowAttributes={setShowAttributes}
            />
          </EnclosingListSelectionProvider>
        }
      </Stack>

      <MapShower>
        <MapDrawExperiment />
        <MapPositionOnUrl />
        <MapPlacer
          markedPoints={markedPoints}
          setMarkedPoints={setMarkedPoints}
        />
        <EnclosingListSelectionProvider>
          <DeviceMarkersShown
            showDeviceNames={showDeviceNames}
          />
        </EnclosingListSelectionProvider>
        <ActionsOnMapDoer />
        <CurrMouseLocation />
      </MapShower>

      <EditToolBox
        // handleSetOne={handleMapClick}
        // handleSetMany={handlePutEntities}
        markedPoints={markedPoints}
        setMarkedPoints={setMarkedPoints}
        showEditBox={showEditBox}
        setShowEditBox={setShowEditBox}
      >
        <MapCoordinates showAsLatLong={!currTrial?.shownMapName} />
      </EditToolBox>
    </>
  )
}

