import React from 'react';
import { Grid } from '@mui/material';
import { ButtonWithShadow } from './ButtonWithShadow';

const Square = ({ classes, onSubmit }) => {
  return (
    <Grid
      container
      // className={classes.tool}
      style={{ display: 'flex', flexDirection: 'column' }}>
      <ButtonWithShadow className="button" text="distribute" onClick={onSubmit} />
    </Grid>
  );
};

export default Square;
