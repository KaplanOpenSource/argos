import React, { useState } from 'react';
import { AppHeader } from './AppHeader';
import { ExperimentList } from '../Experiment/ExperimentList';
import { MapShower } from '../Map/MapShower';
import { DeviceTable } from '../DeviceTable/DeviceTable';
import { Stack } from '@mui/material';
import { MapPlacer } from '../Map/MapPlacer';
import { DeviceMarkersShown } from '../Map/Device/DeviceMarkersShown';
import { MapPositionOnUrl } from '../Map/MapPositionOnUrl';
import { EditToolBox } from '../EditToolBox/EditToolBox';
import { ActionsOnMapDoer } from '../Map/ActionsOnMapContext';
import { MapCoordinates } from '../Map/MapCoordinates';
import { useExperimentProvider } from '../Context/ExperimentProvider';
import { SHOW_ALL_EXPERIMENTS } from './ShowConfigToggles';
import { EnclosingListSelectionProvider } from '../Experiment/EnclosedSelectionProvider';
import { AppHeaderButtons } from './AppHeaderButtons';
import { MapDrawExperiment } from '../MapDraw/MapDrawExperiment';
import { CurrMouseLocation } from '../Context/useCurrMouseLocation';
import { ServerUpdatesHandler } from '../Context/useServerUpdates';
import { UndoRedoHandler } from './UndoRedo/useUndoRedo';
import { ChosenTrialOnUrl } from '../Context/ChosenTrialOnUrl';
import { AllExperimentsLoader } from '../Context/AllExperimentsLoader';

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

