import { useState } from "react";
import { Box, IconButton, Popper } from "@mui/material";
import AccountTreeIcon from '@mui/icons-material/AccountTree';

export const AttributeTypesDialogButton = ({ }) => {
    const [anchorEl, setAnchorEl] = useState(null);
    return (
        <>
            <IconButton
                onClick={(e) => { e.stopPropagation(); setAnchorEl(anchorEl ? null : e.currentTarget); }}
                color={Boolean(anchorEl) ? "primary" : ""}
            >
                <AccountTreeIcon />
            </IconButton>
            <Popper
                open={Boolean(anchorEl)}
                anchorEl={anchorEl}
                placement="right"
                sx={{ zIndex: 1000 }}
            >
                <Box sx={{ border: 1, p: 1 }}>
                    The content of the Popper.
                </Box>
            </Popper>
        </>
    )
}