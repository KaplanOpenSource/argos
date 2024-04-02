import { Button, IconButton, Stack, Tooltip } from "@mui/material";
import { DateProperty } from "../Utils/DateProperty";
import { TreeRow } from "../App/TreeRow";
import { experimentContext } from "../Context/ExperimentProvider";
import { useContext } from "react";
import DeleteIcon from '@mui/icons-material/Delete';
import { GridOn } from "@mui/icons-material";
import { AttributeItemList } from "./AttributeItemList";
import { SCOPE_TRIAL } from "./AttributeType";
import { TextFieldDebounceOutlined } from "../Utils/TextFieldDebounce";

export const Trial = ({ data, setData, experiment, trialType, children }) => {
    const { currTrial, setCurrTrial } = useContext(experimentContext);
    return (
        <TreeRow
            key={data.name}
            data={data}
            setData={setData}
            components={
                <>
                    <DateProperty
                        data={data.createdDate}
                        setData={val => setData({ ...data, createdDate: val })}
                        label="Created Date"
                    />
                    <Tooltip title="Select trial for editing" placement="top">
                        <IconButton
                            size="small"
                            onClick={() => {
                                setCurrTrial({ experimentName: experiment.name, trialTypeName: trialType.name, trialName: data.name });
                            }}
                        >
                            <GridOn color={data === currTrial.trial ? "primary" : ""} />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete trial" placement="top">
                        <IconButton
                            size="small"
                            onClick={() => setData(undefined)}
                        >
                            <DeleteIcon />
                        </IconButton>
                    </Tooltip>
                    {children}
                </>
            }
        >
            <Stack direction='column' alignItems="stretch">
                <TextFieldDebounceOutlined
                    sx={{ paddingLeft: 0 }}
                    label="Description"
                    value={data.description}
                    onChange={val => setData({ ...data, description: val })}
                    multiline={true}
                    rows={2}
                />
            </Stack>
            <AttributeItemList
                attributeTypes={trialType.attributeTypes}
                data={data}
                setData={setData}
                scope={SCOPE_TRIAL}
            />
        </TreeRow>
    )
}
