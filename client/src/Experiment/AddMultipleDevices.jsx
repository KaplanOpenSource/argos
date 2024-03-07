import { DynamicFeed, PlayArrow } from "@mui/icons-material"
import { IconButton, Tooltip } from "@mui/material"
import { useState } from "react"
import { TextFieldDebounce } from "../Utils/TextFieldDebounce";

export const AddMultipleDevices = ({ deviceType, addDevices }) => {
    const [open, setOpen] = useState(false);
    const [instances, setInstances] = useState(10);
    const [prefix, setPrefix] = useState(deviceType.name + "_");
    const [digits, setDigits] = useState(3);
    const [suffix, setSuffix] = useState("");

    const createNewDevices = () => {
        const newDevices = [];
        for (let i = 1; i <= instances; ++i) {
            const name = prefix + ('' + i).padStart(digits, '0') + suffix;
            newDevices.push({ name });
        }
        addDevices(newDevices);
        setOpen(false);
    }

    return (
        <>
            <Tooltip title={"Add Multiple"} placement="right">
                <IconButton
                    color={open ? "primary" : ""}
                    onClick={(e) => {
                        e.stopPropagation();
                        setOpen(!open)
                    }}
                >
                    <DynamicFeed />
                </IconButton>
            </Tooltip>
            {open && (
                <>
                    <TextFieldDebounce
                        sx={{
                            width: 120,
                        }}
                        variant='outlined'
                        label="New devices"
                        type="number"
                        size='small'
                        InputLabelProps={{ shrink: true }}
                        onChange={val => setInstances(val)}
                        value={instances}
                    />
                    <TextFieldDebounce
                        sx={{
                            width: 150,
                        }}
                        variant='outlined'
                        label="Name prefix"
                        size='small'
                        InputLabelProps={{ shrink: true }}
                        onChange={val => setPrefix(val)}
                        value={prefix}
                    />
                    <TextFieldDebounce
                        sx={{
                            width: 100,
                        }}
                        variant='outlined'
                        label="Digits"
                        type="number"
                        size='small'
                        InputLabelProps={{ shrink: true }}
                        onChange={val => setDigits(val)}
                        value={digits}
                    />
                    <TextFieldDebounce
                        sx={{
                            width: 150,
                        }}
                        variant='outlined'
                        label="Name suffix"
                        size='small'
                        InputLabelProps={{ shrink: true }}
                        onChange={val => setSuffix(val)}
                        value={suffix}
                    />
                    <Tooltip title={"Create"} placement="right">
                        <IconButton
                            onClick={(e) => {
                                e.stopPropagation();
                                createNewDevices();
                            }}
                        >
                            <PlayArrow />
                        </IconButton>
                    </Tooltip>
                </>
            )}
        </>
    )
}