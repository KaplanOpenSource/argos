import { Button as MuiButton } from '@mui/material';
import React from 'react';
import { toTitleCase } from '../../Utils/utils';

export const ButtonWithShadow = ({ text, ...rest }) => {
  return (
    <div style={{ width: '100%', boxShadow: '0px -2px 20px rgba(105, 97, 97, 0.08)' }}>
      <MuiButton
        variant="outlined"
        color="primary"
        sx={{
            paddingInline:'5px',
            width: '95%',
            margin: '5px auto',
            textTransform: 'none',
        }}
        {...rest}
      >
        {toTitleCase(text)}
      </MuiButton>
    </div>
  );
};
