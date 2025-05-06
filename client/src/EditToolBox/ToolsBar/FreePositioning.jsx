import React from 'react';
import { Grid, Stack, TextField } from '@mui/material';

const FreePositioning = ({ onSubmit, buttonText }) => {
  const [pos, setPos] = React.useState({ x: 0, y: 0 });
  const onChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setPos((p) => ({ ...p, [name]: parseFloat(value) }));
  };
  return (
    <Stack direction="column" spacing={1}>
      <TextField
        key="x-input"
        id="x-input"
        label="x"
        onChange={onChange}
        name="x"
        defaultValue={pos.x}
        InputLabelProps={{ shrink: true }}
        size='small'
      />
      <TextField
        key="y-input"
        id="y-input"
        label="y"
        onChange={onChange}
        name="y"
        defaultValue={pos.y}
        InputLabelProps={{ shrink: true }}
        size='small'
      />
    </Stack>
  );
};

export default FreePositioning;
