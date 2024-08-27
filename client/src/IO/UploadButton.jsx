import React, { useRef, useState } from "react";
import { ButtonTooltip } from "../Utils/ButtonTooltip";
import { HourglassBottom } from "@mui/icons-material";
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Typography } from "@mui/material";

export const UploadButton = ({ accept, tooltip, uploadFunc, children }) => {
    const inputFile = useRef(null);
    const [working, setWorking] = useState(false);
    const [errors, setErrors] = useState(undefined);

    const handleChangeFile = async (event) => {
        try {
            setWorking(true);
            const file = event.target.files[0];
            if (!file) {
                throw "empty file";
            }
            const errors = await uploadFunc(file);
            if (errors) {
                setErrors(errors);
            }
        } catch (error) {
            console.log(error)
            alert(`problem uploading:\n${error}`)
        }
        setWorking(false);
    };

    return (
        <>
            {errors
                ? <>
                    <Dialog open={true} onClose={() => setErrors(undefined)} maxWidth={false} fullWidth={true} scroll="paper">
                        <DialogTitle >File upload with {errors.length} errors</DialogTitle>
                        <DialogContent>
                            <DialogContentText>
                                {errors.map((e, i) => (
                                    <Typography key={i}>
                                        {i + 1}: {e}
                                    </Typography>
                                ))}
                            </DialogContentText>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={() => setErrors(undefined)}>Close</Button>
                        </DialogActions>
                    </Dialog>
                </>
                : <>
                    <input
                        type="file"
                        ref={inputFile}
                        style={{ display: "none" }}
                        onChange={handleChangeFile}
                        accept={accept}
                    />
                    <ButtonTooltip
                        color="inherit"
                        onClick={() => inputFile.current.click()}
                        disabled={working}
                        tooltip={tooltip}
                    >
                        {working
                            ? <HourglassBottom />
                            : <>
                                {children}
                            </>
                        }
                    </ButtonTooltip>
                </>
            }
        </>
    );
};
