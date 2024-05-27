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
import { EnclosingListSelectionProvider } from '../Experiment/EnclosedSelectionProvider';

export function DevicePlanner() {
    const [showEditBox, setShowEditBox] = useState(false);
    const [markedPoints, setMarkedPoints] = useState([]);
    const [fullscreen, setFullscreen] = useState(false);
    const [showConfig, setShowConfig] = useState(SHOW_ALL_EXPERIMENTS);
    const [showAttributes, setShowAttributes] = useState(false);
    const { currTrial } = useContext(experimentContext);

    return (
        <>
            <AppHeader
                fullscreen={fullscreen}
                setFullscreen={setFullscreen}
                showConfig={showConfig}
                setShowConfig={setShowConfig}
                showAttributes={showAttributes}
                setShowAttributes={setShowAttributes}
            />
            <Stack direction={'row'} justifyContent="space-between" alignItems="flex-start">
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

            <MapShower
            >
                <MapPositionOnUrl
                />
                <MapPlacer
                    markedPoints={markedPoints}
                    setMarkedPoints={setMarkedPoints}
                />
                <EnclosingListSelectionProvider>
                    <DeviceMarkersShown
                    />
                </EnclosingListSelectionProvider>
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

