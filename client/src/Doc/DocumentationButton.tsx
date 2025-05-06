import { Help } from "@mui/icons-material"
import { ButtonTooltip } from "../Utils/ButtonTooltip"
import { useState } from "react"
import { Dialog } from "@mui/material";
import { Documentation } from "./Documentation";

export const DocumentationButton = () => {
    const [open, setOpen] = useState(false);
    return (
        <>
            <ButtonTooltip
                color="inherit"
                onClick={() => setOpen(true)}
            >
                <Help />
            </ButtonTooltip>
            <Dialog
                open={open}
                onClose={() => setOpen(false)}
                maxWidth='100%'
            >
                <Documentation />
            </Dialog>
        </>
    )
}