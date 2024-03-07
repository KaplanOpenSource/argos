import React from 'react';
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
    ARC_SHAPE
} from './utils/constants.js';

import { EditTool } from './EditTool.jsx';
import FreePositioning from './ToolsBar/FreePositioning.jsx';
import DistributeAlongLine from './ToolsBar/DistributeAlongLine.jsx';
import DistributeAlongArc from './ToolsBar/DistributeAlongArc.jsx';
import Rectangle from './ToolsBar/Rectangle.jsx';

export const EditToolBox = ({
    handleSetOne,
    handleSetMany,
    markedPoints,
    setMarkedPoints,
    showEditBox,
    setShowEditBox,
    children,
}) => {
    const {
        shape,
        setShape,
        // rectRows,
        // setRectRows,
        // shapeOptions
    } = useShape();

    const onClickIcon = (id) => {
        if (id === shape) {
            setShowEditBox(!showEditBox);
        } else {
            setShowEditBox(true);
            setMarkedPoints([]);
            setShape(id);
        }
    };

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
                <EditTool shape={shape} onClickIcon={onClickIcon} markedPoints={markedPoints} showEditBox={false}
                    id={CHOOSE_SHAPE}
                    icon={<PlaceIcon />}
                    component={<PlaceIcon />}
                    title={CHOOSE_TITLE}
                />
                <EditTool shape={shape} onClickIcon={onClickIcon} markedPoints={markedPoints} showEditBox={showEditBox}
                    id={FREEPOSITIONING_SHAPE}
                    icon={<FreePositioningIcon />}
                    component={<FreePositioning />}
                    title={FREEPOSITIONING_TITLE}
                    onSubmit={pos => handleSetOne({ latlng: { lat: pos.x, lng: pos.y } })}
                    submitText={"free position"}
                />
                <EditTool shape={shape} onClickIcon={onClickIcon} markedPoints={markedPoints} showEditBox={showEditBox}
                    id={POINT_SHAPE}
                    icon={<DotIcon />}
                    component={<FreePositioning />}
                    title={POINT_TITLE}
                    onSubmit={pos => handleSetOne({ latlng: { lat: pos.x, lng: pos.y } })}
                    submitText={"position all"}
                />
                <EditTool shape={shape} onClickIcon={onClickIcon} markedPoints={markedPoints} showEditBox={showEditBox}
                    id={CURVE_SHAPE}
                    icon={<CurveIcon />}
                    component={<DistributeAlongLine />}
                    title={CURVE_TITLE}
                    onSubmit={handleSetMany}
                />
                <EditTool shape={shape} onClickIcon={onClickIcon} markedPoints={markedPoints} showEditBox={showEditBox}
                    id={DISTRIBUTE_ALONG_LINE_SHAPE}
                    icon={<DistrubteAlongLineIcon />}
                    component={<DistributeAlongLine />}
                    title={DISTRIBUTE_ALONG_LINE_TITLE}
                    onSubmit={handleSetMany}
                />
                <EditTool shape={shape} onClickIcon={onClickIcon} markedPoints={markedPoints} showEditBox={showEditBox}
                    id={ARC_SHAPE}
                    icon={<RotateLeftIcon fontSize="large" />}
                    component={<DistributeAlongArc />}
                    onSubmit={handleSetMany}
                    title={ARC_TITLE}
                />
                <EditTool shape={shape} onClickIcon={onClickIcon} markedPoints={markedPoints} showEditBox={showEditBox}
                    id={RECTANGLE_SHAPE}
                    icon={<RectangleIcon />}
                    component={<Rectangle />}
                    title={RECTANGLE_TITLE}
                    onSubmit={handleSetMany}
                />
                {children}
            </Stack>
        </Paper>
    );
}
