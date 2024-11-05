import React, { useRef, useState } from "react";
import { ButtonTooltip } from "../Utils/ButtonTooltip";
import { HourglassBottom } from "@mui/icons-material";
import { ErrorsDialog } from "./ErrorsDialog";

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
                ? <ErrorsDialog
                    errors={errors}
                    onClose={() => setErrors(undefined)}
                />
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
