import React, { Fragment } from "react";
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";

export const ErrorsDialog = ({ errors, onClose, isOpen }) => {
    return (
        <>
            {!isOpen ? null :
                <Dialog open={isOpen} onClose={onClose} maxWidth={false} fullWidth={true} scroll="paper">
                    <DialogTitle >File upload with {errors?.length} errors</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            {errors?.sort().map((e, i) => (
                                <Fragment key={i + 1}>
                                    <span>
                                        {i + 1}: {`${e}`}
                                    </span>
                                    <br />
                                </Fragment>
                            ))}
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={onClose}>Close</Button>
                    </DialogActions>
                </Dialog>
            }
        </>
    )
}