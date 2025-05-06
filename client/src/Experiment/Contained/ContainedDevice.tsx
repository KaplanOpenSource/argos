import {
  Clear,
  NearMe
} from '@mui/icons-material';
import {
  Paper,
  Typography
} from '@mui/material';
import React from 'react';
import { usePopupSwitch } from '../../Map/PopupSwitchContext';
import { ButtonTooltip } from '../../Utils/ButtonTooltip';

export const ContainedDevice = ({
  deviceItemName,
  deviceTypeName,
  disconnectDevice,
}) => {
  const { switchToPopup } = usePopupSwitch();
  const showEntity = () => {
    switchToPopup(deviceTypeName + ' : ' + deviceItemName);
  }

  return (
    <Paper
      // key={childEntityItemKey}
      style={{
        marginTop: 5,
        marginBottom: 5,
        marginRight: 0,
        marginLeft: 0,
        paddingRight: 10,
        paddingLeft: 10,
        display: "flex",
      }}
    >
      <Typography
        variant='body1'
        style={{
          margin: 0,
          marginRight: '10px',
          display: 'inline-block'
        }}
      >
        {deviceItemName}
        {/* {!search ? 'unknown ' + childEntityItemKey : (
                    <>
                        {search.entityItem.name}
                    </>
                )} */}
      </Typography>
      <ButtonTooltip
        key='show'
        // color='default'
        disabled={false}
        tooltip={'Show this entity'}
        onClick={showEntity}
        style={{ marginLeft: "auto" }}
        closeTooltipOnClick={true}
      >
        <NearMe />
      </ButtonTooltip>
      {!disconnectDevice ? null :
        <ButtonTooltip
          key='remove'
          // color='secondary'
          disabled={false}
          tooltip={'Disconnect this entity'}
          onClick={disconnectDevice}
          style={{ marginLeft: "auto" }}
        >
          <Clear />
        </ButtonTooltip>
      }
    </Paper>
  )
}