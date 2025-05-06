import PlaceIcon from '@mui/icons-material/Place';
import RotateLeftIcon from '@mui/icons-material/RotateLeft';
import {
  Paper,
  Stack,
} from '@mui/material';
import React from 'react';

import { useShape } from './ShapeContext.jsx';
import {
  ARC_SHAPE,
  ARC_TITLE,
  CHOOSE_SHAPE,
  CHOOSE_TITLE,
  CURVE_SHAPE,
  CURVE_TITLE,
  DISTRIBUTE_ALONG_LINE_SHAPE,
  DISTRIBUTE_ALONG_LINE_TITLE,
  FREEPOSITIONING_SHAPE,
  FREEPOSITIONING_TITLE,
  POINT_SHAPE,
  POINT_TITLE,
  RECTANGLE_SHAPE,
  RECTANGLE_TITLE,
  SELECT_SHAPE,
  SELECT_TITLE
} from './utils/constants.js';
import CurveIcon from './utils/icons/CurveIcon.svg?react';
import DistrubteAlongLineIcon from './utils/icons/DistrubteAlongLineIcon.svg?react';
import DotIcon from './utils/icons/DotIcon.svg?react';
import FreePositioningIcon from './utils/icons/FreePositioningIcon.svg?react';
import RectangleIcon from './utils/icons/RectangleIcon.svg?react';

import { PlaylistAdd } from '@mui/icons-material';
import { useExperimentProvider } from '../Context/ExperimentProvider.jsx';
import { useCurrTrial } from '../Context/useCurrTrial';
import { useDeviceSeletion } from '../Context/useDeviceSeletion';
import { EditTool } from './EditTool.jsx';
import DistributeAlongArc from './ToolsBar/DistributeAlongArc.jsx';
import DistributeAlongLine from './ToolsBar/DistributeAlongLine.jsx';
import FreePositioning from './ToolsBar/FreePositioning.jsx';
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
  const { shape, setShape, shapeData, } = useShape();

  const { selection, setSelection } = useDeviceSeletion();
  const { currTrial } = useExperimentProvider();
  const { trial } = useCurrTrial({});

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
    if (selection.length > 0) {
      const positions = shapeData.toPositions(markedPoints, selection.length);

      trial.batch((draft) => {
        let i = 0;
        for (const s of selection) {
          const dev = draft.getDevice(s.deviceTypeName, s.deviceItemName);
          dev.setLocationOnMap(positions[i++], currTrial.shownMapName);
        }
      });
      setSelection([]);
    }

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
