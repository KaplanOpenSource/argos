import { TreeRow } from "../App/TreeRow";
import { DeviceItem } from "./DeviceItem";
import { TreeSublist } from "../App/TreeSublist";
import { AttributeType } from "./AttributeType";
import { Box, IconButton, Popover, Popper } from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import { changeByName } from "../Utils/utils";
import { AddMultipleDevices } from "./AddMultipleDevices";
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import { useState } from "react";

export const DeviceType = ({ data, setData }) => {
    const [anchorEl, setAnchorEl] = useState(null);
    // console.log(anchorEl)
    return (
        <TreeRow
            key={data.name}
            data={data}
            setData={setData}
            components={
                <>
                    <IconButton
                        onClick={() => setData(undefined)}
                    >
                        <DeleteIcon />
                    </IconButton>
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
            }
        >
            <TreeSublist
                parentKey={data.name}
                data={data}
                fieldName='devices'
                nameTemplate='New Device'
                setData={setData}
                components={
                    <AddMultipleDevices
                        deviceType={data}
                        addDevices={newDevices => setData({ ...data, devices: [...(data.devices || []), ...newDevices] })}
                    />
                }
            >
                {
                    (data.devices || []).map(itemData => (
                        <DeviceItem
                            key={itemData.name}
                            data={itemData}
                            setData={newData => {
                                setData({ ...data, devices: changeByName(data.devices, itemData.name, newData) });
                            }}
                            deviceType={data}
                        />
                    ))
                }
            </TreeSublist>

            <TreeSublist
                parentKey={data.name}
                data={data}
                fieldName='attributeTypes'
                nameTemplate='New Attribute Type'
                setData={setData}
                newDataCreator={() => {
                    return {
                        type: 'String',
                    }
                }}
            >
                {
                    (data.attributeTypes || []).map(itemData => (
                        <AttributeType
                            key={itemData.name}
                            data={itemData}
                            setData={newData => {
                                setData({ ...data, attributeTypes: changeByName(data.attributeTypes, itemData.name, newData) });
                            }}
                        />
                    ))
                }
            </TreeSublist>

        </TreeRow>
    )
}
