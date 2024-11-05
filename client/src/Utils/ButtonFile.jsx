import { useRef } from "react";
import { ButtonTooltip } from "./ButtonTooltip";

export const ButtonFile = ({ accept, tooltip, onChange, children, ...restprops }) => {
    const inputFile = useRef(null);

    return (
        <>
            <input
                type="file"
                ref={inputFile}
                style={{ display: "none" }}
                onChange={e => onChange(e.target.files)}
                accept={accept}
            />
            <ButtonTooltip
                color="inherit"
                onClick={() => inputFile.current.click()}
                tooltip={tooltip}
                {...restprops}
            >
                {children}
            </ButtonTooltip>
        </>
    )
}