import React, { useState } from "react";
import { HourglassBottom } from "@mui/icons-material";
import { ErrorsDialog } from "./ErrorsDialog";
import { ButtonFile } from "../Utils/ButtonFile";

export const UploadButton = ({ accept, tooltip, uploadFunc, children, ...restprops }) => {
    const [working, setWorking] = useState(false);
    const [errors, setErrors] = useState(undefined);

    const handleChangeFile = async (files) => {
        try {
            setWorking(true);
            if (!files || !files.length) {
                throw "empty file";
            }
            const errors = await uploadFunc(files[0]);
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
            <ButtonFile
                color="inherit"
                accept={accept}
                tooltip={tooltip}
                onChange={handleChangeFile}
                disabled={working}
                {...restprops}
            >
                {working
                    ? <HourglassBottom />
                    : <>
                        {children}
                    </>
                }
            </ButtonFile>
            <ErrorsDialog
                isOpen={errors && errors?.length}
                errors={errors}
                onClose={() => setErrors(undefined)}
            />
        </>
    );
};
