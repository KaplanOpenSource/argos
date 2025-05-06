import AccountTreeIcon from '@mui/icons-material/AccountTree';
import { Paper, Popover } from "@mui/material";
import { useState } from "react";
import { ButtonTooltip } from "../Utils/ButtonTooltip";
import { AttributeTypesDialog } from "./AttributeTypesDialog";

export const AttributeTypesDialogButton = ({ data, setData, isOfDevice, containers }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  return (
    // ClickAwayListener onClickAway={() => setAnchorEl(null)}>
    <>
      <ButtonTooltip
        tooltip="Edit attribute types"
        onClick={(e) => {
          e.stopPropagation();
          setAnchorEl(anchorEl ? null : e.currentTarget);
        }}
        color={Boolean(anchorEl) ? "primary" : ""}
      >
        <AccountTreeIcon />
      </ButtonTooltip>
      <Popover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={e => {
          e.stopPropagation();
          setAnchorEl();
        }}
        anchorOrigin={{ vertical: 'top', horizontal: 'right', }}
        transformOrigin={{ vertical: 'top', horizontal: 'left', }}
        sx={{ zIndex: 1000 }}
      >
        <Paper sx={{ border: 1, p: 1 }}
          onClick={e => e.stopPropagation()}
        >
          <AttributeTypesDialog
            data={data}
            setData={setData}
            isOfDevice={isOfDevice}
            containers={containers}
          />
        </Paper>
      </Popover>
    </>
    // </ClickAwayListener>
  )
}