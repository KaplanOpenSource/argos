import React, { Fragment, useRef, useState } from "react";
import { ButtonTooltip } from "../Utils/ButtonTooltip";
import { HourglassBottom } from "@mui/icons-material";
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Typography } from "@mui/material";

export const UploadButton = ({ accept, tooltip, uploadFunc, children, ...restprops }) => {
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
            {errors && errors.length
                ? <>
                    <Dialog open={true} onClose={() => setErrors(undefined)} maxWidth={false} fullWidth={true} scroll="paper">
                        <DialogTitle >File upload with {errors.length} errors</DialogTitle>
                        <DialogContent>
                            <DialogContentText>
                                {errors.sort().map((e, i) => (
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
                        {...restprops}
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
