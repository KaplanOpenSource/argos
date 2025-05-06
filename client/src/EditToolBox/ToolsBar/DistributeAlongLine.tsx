import React from 'react';
import { Stack, TextField, Typography } from '@mui/material';
import processingDecimalDigits from '../../Utils/processingDecimalDigits';

const DistributeAlongLine = ({ onSubmit, markedPoints, title }) => {
  const points = Array.from({ ...markedPoints, length: Math.max(2, markedPoints.length) });
  const positions = points.map((p, i) => {
    const x = p ? processingDecimalDigits(p[0]) : '';
    const y = p ? processingDecimalDigits(p[1]) : '';
    const label = (i === 0) ? "start" : ((i === points.length - 1) ? "end" : (i + 1));
    return { label, x, y };
  })

  return (
    <Stack direction="column" spacing={1}>
      {positions.map((point, index) => (
        <Stack direction="row" key={index}>
          <Typography component="span" minWidth={40}>{point.label}</Typography>
          <TextField
            InputProps={{ style: { fontSize: 14 } }}
            id="x-input"
            label="x"
            value={point.x}
            InputLabelProps={{ shrink: true }}
            fullWidth={true}
            size='small'
          />
          <TextField
            InputProps={{ style: { fontSize: 14 } }}
            id="y-input"
            label="y"
            value={point.y}
            InputLabelProps={{ shrink: true }}
            fullWidth={true}
            size='small'
          />
        </Stack>
      ))}
      {/* <Button className="button" text="distribute" onClick={onSubmit} /> */}
    </Stack>
  );
};

export default DistributeAlongLine;
