import { useState } from "react";
import { Box, IconButton, Paper, Popper, Tooltip } from "@mui/material";
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { TreeSublist } from "../App/TreeSublist";
import { AttributeType } from "./AttributeType";
import { changeByName } from "../Utils/utils";
import { TreeView } from "@mui/x-tree-view/TreeView";
import { valueTypeDefault } from "./AttributeValue";

export const AttributeTypesDialogButton = ({ data, setData, omitExperimentScope }) => {
    const [anchorEl, setAnchorEl] = useState(null);
    return (
        // ClickAwayListener onClickAway={() => setAnchorEl(null)}>
        <>
            <Box sx={{ position: 'relative' }}>
                <Tooltip title="Edit attribute types" placement="top">
                    <IconButton
                        size="small"
                        onClick={(e) => { e.stopPropagation(); setAnchorEl(anchorEl ? null : e.currentTarget); }}
                        color={Boolean(anchorEl) ? "primary" : ""}
                    >
                        <AccountTreeIcon />
                    </IconButton>
                </Tooltip>
                <Popper
                    open={Boolean(anchorEl)}
                    anchorEl={anchorEl}
                    placement="right-start"
                    sx={{ zIndex: 1000 }}
                >
                    <Paper sx={{ border: 1, p: 1 }}
                        onClick={e => e.stopPropagation()}
                    >
                        <TreeView
                            defaultCollapseIcon={<ExpandMoreIcon />}
                            defaultExpandIcon={<ChevronRightIcon />}
                            disableSelection
                            defaultExpanded={[data.name + '_' + 'attributeTypes']}
                        >
                            <TreeSublist
                                parentKey={data.name}
                                data={data}
                                fieldName='attributeTypes'
                                nameTemplate='New Attribute Type'
                                setData={setData}
                                newDataCreator={() => {
                                    return {
                                        type: valueTypeDefault,
                                    }
                                }}
                            >
                                {
                                    (data.attributeTypes || []).map(itemData => (
                                        <AttributeType
                                            key={itemData.name}
                                            data={itemData}
                                            setData={newData => {
                                                setData({
                                                    ...data,
                                                    attributeTypes: changeByName(data.attributeTypes, itemData.name, newData)
                                                });
                                            }}
                                            omitExperimentScope={omitExperimentScope}
                                        />
                                    ))
                                }
                            </TreeSublist>
                        </TreeView>
                    </Paper>
                </Popper>
            </Box>
        </>
        // </ClickAwayListener>
    )
}