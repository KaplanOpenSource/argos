import React from 'react';
import { useContext } from 'react';
import {
    Divider,
    Box,
    Stack,
    Paper,
    IconButton,
} from '@mui/material';
import RotateLeftIcon from '@mui/icons-material/RotateLeft';
import PlaceIcon from '@mui/icons-material/Place';

import { useShape } from './ShapeContext.jsx';
import CurveIcon from './utils/icons/CurveIcon.svg?react';
import DotIcon from './utils/icons/DotIcon.svg?react';
import DistrubteAlongLineIcon from './utils/icons/DistrubteAlongLineIcon.svg?react';
import FreePositioningIcon from './utils/icons/FreePositioningIcon.svg?react';
import RectangleIcon from './utils/icons/RectangleIcon.svg?react';
import {
    FREEPOSITIONING_TITLE,
    POINT_TITLE,
    CURVE_TITLE,
    DISTRIBUTE_ALONG_LINE_TITLE,
    RECTANGLE_TITLE,
    FREEPOSITIONING_SHAPE,
    POINT_SHAPE,
    CURVE_SHAPE,
    DISTRIBUTE_ALONG_LINE_SHAPE,
    RECTANGLE_SHAPE,
    CHOOSE_SHAPE,
    CHOOSE_TITLE,
    ARC_TITLE,
    ARC_SHAPE,
    SELECT_SHAPE,
    SELECT_TITLE
} from './utils/constants.js';

import { EditTool } from './EditTool.jsx';
import FreePositioning from './ToolsBar/FreePositioning.jsx';
import DistributeAlongLine from './ToolsBar/DistributeAlongLine.jsx';
import DistributeAlongArc from './ToolsBar/DistributeAlongArc.jsx';
import Rectangle from './ToolsBar/Rectangle.jsx';
import { experimentContext } from '../Context/ExperimentProvider.jsx';
import { PlaylistAdd } from '@mui/icons-material';

export const EditToolBox = ({
    handleSetOne,
    handleSetMany,
    markedPoints,
    setMarkedPoints,
    showEditBox,
    setShowEditBox,
    children,
}) => {
    const { shape, setShape, shapeData, } = useShape();

    const { selection, setLocationsToStackDevices } = useContext(experimentContext);

    const onClickIcon = (id) => {
        if (id === shape) {
            setShowEditBox(!showEditBox);
        } else {
            setShowEditBox(true);
            setMarkedPoints([]);
            setShape(id);
        }
    };

    const setMultipleDeviceLocations = () => {
        const positions = shapeData.toPositions(markedPoints, selection.length);
        setLocationsToStackDevices(positions);
        setMarkedPoints([]);
        setShowEditBox(false);
    }

    return (
        <Paper
            sx={{
                zIndex: 1000,
                position: 'absolute',
                bottom: 10,
                left: 10
            }}
        >
            <Stack
                direction="row"
            >
                <EditTool
                    shape={shape}
                    onClickIcon={onClickIcon}
                    showEditBox={false}
                    id={CHOOSE_SHAPE}
                    icon={<PlaceIcon />}
                    title={CHOOSE_TITLE}
                >
                </EditTool>
                <EditTool
                    shape={shape}
                    onClickIcon={onClickIcon}
                    showEditBox={false}
                    id={SELECT_SHAPE}
                    icon={<PlaylistAdd />}
                    title={SELECT_TITLE}
                >
                </EditTool>
                <EditTool
                    shape={shape}
                    onClickIcon={onClickIcon}
                    showEditBox={showEditBox}
                    id={FREEPOSITIONING_SHAPE}
                    icon={<FreePositioningIcon />}
                    title={FREEPOSITIONING_TITLE}
                    onSubmit={pos => handleSetOne({ latlng: { lat: pos.x, lng: pos.y } })}
                    submitText={"free position"}
                >
                    <FreePositioning
                        markedPoints={markedPoints}
                    />
                </EditTool>
                <EditTool
                    shape={shape}
                    onClickIcon={onClickIcon}
                    showEditBox={showEditBox}
                    id={POINT_SHAPE}
                    icon={<DotIcon />}
                    title={POINT_TITLE}
                    onSubmit={pos => handleSetOne({ latlng: { lat: pos.x, lng: pos.y } })}
                    submitText={"position all"}
                >
                    <FreePositioning
                        markedPoints={markedPoints}
                    />
                </EditTool>
                <EditTool
                    shape={shape}
                    onClickIcon={onClickIcon}
                    showEditBox={showEditBox}
                    id={CURVE_SHAPE}
                    icon={<CurveIcon />}
                    title={CURVE_TITLE}
                    onSubmit={setMultipleDeviceLocations}
                >
                    <DistributeAlongLine
                        markedPoints={markedPoints}
                    />
                </EditTool>
                <EditTool
                    shape={shape}
                    onClickIcon={onClickIcon}
                    showEditBox={showEditBox}
                    id={DISTRIBUTE_ALONG_LINE_SHAPE}
                    icon={<DistrubteAlongLineIcon />}
                    title={DISTRIBUTE_ALONG_LINE_TITLE}
                    onSubmit={setMultipleDeviceLocations}
                >
                    <DistributeAlongLine
                        markedPoints={markedPoints}
                    />
                </EditTool>
                <EditTool
                    shape={shape}
                    onClickIcon={onClickIcon}
                    showEditBox={showEditBox}
                    id={ARC_SHAPE}
                    icon={<RotateLeftIcon fontSize="large" />}
                    onSubmit={setMultipleDeviceLocations}
                    title={ARC_TITLE}
                >
                    <DistributeAlongArc
                        markedPoints={markedPoints}
                    />
                </EditTool>
                <EditTool
                    shape={shape}
                    onClickIcon={onClickIcon}
                    showEditBox={showEditBox}
                    id={RECTANGLE_SHAPE}
                    icon={<RectangleIcon />}
                    title={RECTANGLE_TITLE}
                    onSubmit={setMultipleDeviceLocations}
                >
                    <Rectangle
                        markedPoints={markedPoints}
                    />
                </EditTool>
                {children}
            </Stack>
        </Paper>
    );
}
