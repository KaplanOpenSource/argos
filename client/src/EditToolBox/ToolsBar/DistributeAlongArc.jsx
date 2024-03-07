import React from 'react';
import { Grid, Stack, TextField, Typography } from '@mui/material';
import processingDecimalDigits from '../../Utils/processingDecimalDigits';

const DistributeAlongArc = ({ onSubmit, markedPoints }) => {
  const labels = [
    'center',
    'radius',
    'arc',
  ];
  const subset = markedPoints.filter((p, i) => i < 2 || i == markedPoints.length - 1);
  const positions = labels.map((label, i) => {
    const p = subset[i];
    const x = p ? processingDecimalDigits(p[0]) : '';
    const y = p ? processingDecimalDigits(p[1]) : '';
    return { label, x, y };
  })

  return (
    <Stack direction="column">
      {positions.map((point, index) => (
        <Stack direction="row">
          <Typography component="span" minWidth={50}>{positions[index].label}</Typography>
          <TextField
            InputProps={{ style: { fontSize: 14 } }}
            id="x-input"
            label="x"
            value={point.x}
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            InputProps={{ style: { fontSize: 14 } }}
            id="y-input"
            label="y"
            value={point.y}
            InputLabelProps={{ shrink: true }}
          />
        </Stack>
      ))}
      {/* <Button className="button" text="distribute" onClick={onSubmit} /> */}
    </Stack>
  );
};

export default DistributeAlongArc;
