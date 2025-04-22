import React, { ReactNode } from "react";
import { Box, IconButton, Tooltip, Typography } from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import { camelCaseToWords, createNewName } from "../Utils/utils";
import { TreeItem } from "@mui/x-tree-view/TreeItem";
import { assignUuids } from "../Context/TrackUuidUtils";
import { ExperimentTreeNodesExpandedContext } from "../Experiment/ExperimentTreeNodesExpandedProvider";
import { useContext } from "react";
import { INamed } from "../types/types";

export const TreeSublist = ({
    nameTemplate,
    fieldName,
    data,
    setData,
    newDataCreator,
    parentKey,
    components,
    children,
    noAddButton,
}: {
    nameTemplate: string,
    fieldName: string,
    data: INamed,
    setData: (newData: INamed) => void,
    newDataCreator?: () => any,
    parentKey: string,
    noAddButton?: boolean,
    components: ReactNode,
    children: ReactNode,
}) => {
    const {
        addExpandedNode,
    } = useContext(ExperimentTreeNodesExpandedContext);

    const items = data[fieldName] || [];
    const key = parentKey + '_' + fieldName;

    const niceName = camelCaseToWords(fieldName);
    return (
        <TreeItem
            key={key}
            nodeId={key}
            label={
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        alignContent: 'flex-start',
                        // p: 0.5,
                        // pr: 0,
                    }}
                >
                    <Typography variant="body2" sx={{
                        fontWeight: 'inherit',
                        //  flexGrow: 1
                    }}>
                        {niceName} ({items.length})
                    </Typography>
                    {noAddButton ? null :
                        <Tooltip title="Add New" placement="right">
                            <IconButton
                                sx={{
                                    display: 'flex',
                                    alignSelf: 'flex-start',
                                    alignContent: 'flex-start',
                                    alignItems: 'flex-start',
                                }}
                                // color="inherit"
                                onClick={e => {
                                    e.stopPropagation();
                                    const name = createNewName(items, nameTemplate);
                                    const noNameData = newDataCreator ? newDataCreator() : {};
                                    const theData: INamed = assignUuids({ name, ...noNameData });
                                    setData({ ...data, [fieldName]: [...items, theData] });
                                    addExpandedNode(key);
                                }}
                            >
                                <AddIcon />
                            </IconButton>
                        </Tooltip>
                    }
                    {components}
                </Box>
            }
        >
            {children}
        </TreeItem>
    )
}
