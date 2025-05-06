import { Stack, TextField, Typography } from '@mui/material';
import React from 'react';
import processingDecimalDigits from '../../Utils/processingDecimalDigits';

const Rectangle = ({ markedPoints }) => {
  const positions = [{ x: '', y: '' }];
  if (markedPoints.length > 0) {
    markedPoints.forEach((markedPoint, index) => {
      const point = { x: markedPoint[0], y: markedPoint[1] };
      positions[index] = {
        x: processingDecimalDigits(point.x),
        y: processingDecimalDigits(point.y),
      };
    });
  }
  return (
    <Stack direction="column" spacing={1}>
      {positions.slice(0, 4).map((point, index) => (
        <Stack direction="row" key={index}>
          <Typography component="span" minWidth={45}>{index + 1}</Typography>
          <TextField
            InputProps={{ style: { fontSize: 14 } }}
            id="x-input"
            label="x"
            value={point.x}
            InputLabelProps={{ shrink: true }}
            size='small'
          />
          <TextField
            InputProps={{ style: { fontSize: 14 } }}
            id="y-input"
            label="y"
            value={point.y}
            InputLabelProps={{ shrink: true }}
            size='small'
          />
        </Stack>
      ))}

      {/* <Button className="button" text="distribute" onClick={onSubmit} /> */}
    </Stack>
  );
};

export default Rectangle;
