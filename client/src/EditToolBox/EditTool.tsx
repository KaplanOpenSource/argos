import CloseIcon from "@mui/icons-material/Close";
import {
  Box,
  Button,
  Grid,
  IconButton,
  Paper,
  Tooltip,
  Typography
} from '@mui/material';
import React from 'react';
import { ButtonWithShadow } from './ToolsBar/ButtonWithShadow';

export const EditTool = ({ icon, id, title, shape, onClickIcon, showEditBox, onSubmit, submitText, children }) => {
  return (
    <>
      <Tooltip
        title={title}
        placement="top"
      >
        <div
          style={{
            borderBottom: shape === id ? '2px solid #27AE60' : '',
          }}
        >
          <Button key={id}
            onClick={() => onClickIcon(id)}
            color='inherit'
            style={{ height: '100%' }}
          >
            {icon}
          </Button>
        </div>
      </Tooltip>
      {showEditBox && shape === id && (
        <Paper
          sx={{
            position: 'absolute',
            bottom: 'calc(100% + 10px)',
            left: 0,
            zIndex: 1000,
            padding: '5px',
            border: 2,
            borderColor: 'black',
          }}
        >
          <Grid container
            style={{
              minWidth: 300,
              minHeight: `100%`
            }}
          >
            <Grid item>
              {children}
            </Grid>
            <Grid item style={{
              display: 'flex',
              justifyContent: 'flex-start',
              alignItems: 'center',
              marginTop: '10px'
            }}>
              <IconButton
                // size='small'
                onClick={() => onClickIcon(id)}
              >
                <CloseIcon />
              </IconButton>
              <Typography component="span">
                <Box sx={{ fontWeight: '700' }}>
                  {title}
                </Box>
              </Typography>
              {!onSubmit ? null :
                <ButtonWithShadow className="button"
                  text={submitText ? submitText : "distribute"}
                  onClick={onSubmit}
                  style={{ right: '0px', marginLeft: '5px' }}
                />
              }
            </Grid>

          </Grid>
        </Paper>
      )}
    </>
  );
}