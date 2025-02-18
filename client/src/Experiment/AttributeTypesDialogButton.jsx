import { useState } from "react";
import { Paper, Popover } from "@mui/material";
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import { TreeSublist } from "../App/TreeSublist";
import { AttributeType } from "./AttributeType";
import { changeByName } from "../Utils/utils";
import { TreeView } from "@mui/x-tree-view/TreeView";
import { VALUE_TYPE_DEFAULT } from "./AttributeValue";
import { ButtonTooltip } from "../Utils/ButtonTooltip";

export const AttributeTypesDialogButton = ({ data, setData, isOfDevice }) => {
    const [anchorEl, setAnchorEl] = useState(null);
    return (
        // ClickAwayListener onClickAway={() => setAnchorEl(null)}>
        <>
            <ButtonTooltip
                tooltip="Edit attribute types"
                onClick={(e) => {
                    e.stopPropagation();
                    setAnchorEl(anchorEl ? null : e.currentTarget);
                }}
                color={Boolean(anchorEl) ? "primary" : ""}
            >
                <AccountTreeIcon />
            </ButtonTooltip>
            <Popover
                open={Boolean(anchorEl)}
                anchorEl={anchorEl}
                onClose={e => {
                    e.stopPropagation();
                    setAnchorEl();
                }}
                anchorOrigin={{ vertical: 'top', horizontal: 'right', }}
                transformOrigin={{ vertical: 'top', horizontal: 'left', }}
                sx={{ zIndex: 1000 }}
            >
                <Paper sx={{ border: 1, p: 1 }}
                    onClick={e => e.stopPropagation()}
                >
                    <TreeView
                        disableSelection
                        defaultExpanded={[data.trackUuid + '_' + 'attributeTypes']}
                    >
                        <TreeSublist
                            parentKey={data.trackUuid}
                            data={data}
                            fieldName='attributeTypes'
                            nameTemplate='New Attribute Type'
                            setData={setData}
                            newDataCreator={() => {
                                return {
                                    type: VALUE_TYPE_DEFAULT,
                                }
                            }}
                        >
                            {
                                (data.attributeTypes || []).map(itemData => (
                                    <AttributeType
                                        key={itemData.trackUuid || Math.random() + ""}
                                        data={itemData}
                                        setData={newData => {
                                            setData({
                                                ...data,
                                                attributeTypes: changeByName(data.attributeTypes, itemData.name, newData)
                                            });
                                        }}
                                        isOfDevice={isOfDevice}
                                    />
                                ))
                            }
                        </TreeSublist>
                    </TreeView>
                </Paper>
            </Popover>
        </>
        // </ClickAwayListener>
    )
}