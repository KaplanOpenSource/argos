import React, { ReactNode } from "react";
import { Box } from "@mui/material";
import { TreeItem } from "@mui/x-tree-view/TreeItem";
import { TextFieldDebounce } from "../Utils/TextFieldDebounce";
import { useEffect } from "react";
import { assignUuids } from "../Context/TrackUuidUtils";
import { INamed, ITrackUuid } from "../types/types";

type IData = INamed & ITrackUuid;

export const TreeRow = ({
    data,
    setData,
    components,
    children,
    boldName = false,
    validateName = (_val) => '',
}: {
    data: IData,
    setData: (newData: IData) => any,
    components: ReactNode,
    children?: ReactNode,
    boldName?: boolean,
    validateName?: (val: string) => string,
}) => {
    const { name } = data;

    useEffect(() => {
        if (!data.trackUuid) {
            console.log("if you get here, then this item was created without a uuid", data);
            setData(assignUuids({ ...data }))
        }
    }, [(data || {}).trackUuid]);

    if (!(data || {}).trackUuid) {
        return null;
    }

    const BOLD_PROPS = {
        InputProps: {
            style: {
                fontWeight: 'bold',
            },
        }
    };

    return (
        <TreeItem
            key={data.trackUuid!}
            nodeId={data.trackUuid!}
            label={
                <div style={{ pointerEvents: 'none' }}>
                    <div style={{ pointerEvents: 'all', display: 'inline-block' }}>
                        <Box sx={{
                            display: 'flex',
                            alignItems: 'center',
                        }}>
                            <TextFieldDebounce
                                sx={{ padding: '5px' }}
                                variant="outlined"
                                size="small"
                                label="Name"
                                InputLabelProps={{ shrink: true }}
                                value={name}
                                onChange={val => setData({ ...data, name: val })}
                                disabled={!setData}
                                {...(boldName ? BOLD_PROPS : {})}
                                validate={validateName}
                            />
                            {components}
                        </Box>
                    </div>
                </div>
            }
        >
            {children}
        </TreeItem>
    )
}