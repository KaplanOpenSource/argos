import { IconButton } from "@mui/material";
import React from "react";
import { TreeRow } from "../App/TreeRow";
import { TreeSublist } from "../App/TreeSublist";
import { BooleanProperty } from "../Property/BooleanProperty";
import { changeByName } from "../Utils/utils";
import Delete from "@mui/icons-material/Delete";
import { IAttributeType, ISelectOption, ITrackUuid } from "../types/types";

export const AttributeTypeOptions = ({
    data,
    setData,
}: {
    data: IAttributeType & ITrackUuid,
    setData: (newData: IAttributeType & ITrackUuid) => void,
}) => {
    return (
        <TreeSublist
            parentKey={data.trackUuid + '_sub'}
            data={data}
            fieldName='options'
            nameTemplate='New Option'
            setData={setData}
            components={
                <>
                    <BooleanProperty
                        label={'multiple'}
                        data={data.multiple}
                        setData={v => setData({ ...data, multiple: v })}
                    />
                </>
            }
        >
            {
                ((data.options || []) as (ISelectOption & ITrackUuid)[]).map(itemData => (
                    <TreeRow
                        key={itemData.trackUuid}
                        data={itemData}
                        setData={newData => {
                            setData({ ...data, options: changeByName(data.options, itemData.name!, newData) });
                        }}
                        components={
                            <>
                                <IconButton
                                    onClick={() => setData({ ...data, options: data?.options?.filter(t => t.name !== itemData.name) })}
                                >
                                    <Delete />
                                </IconButton>
                            </>
                        }
                    >
                    </TreeRow>
                ))
            }
        </TreeSublist >

    )
}