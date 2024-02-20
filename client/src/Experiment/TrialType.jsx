import { useContext } from "react";
import { TreeRow } from "../App/TreeRow";
import { Trial } from "./Trial";
import { TreeSublist } from "../App/TreeSublist";
import { AttributeType } from "./AttributeType";
import dayjs from "dayjs";
import { experimentContext } from "./ExperimentProvider";
import { changeByName } from "../Utils/utils";
import { IconButton } from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';

export const TrialType = ({ data, setData, experimentName }) => {
    const { showExperiments, currTrial } = useContext(experimentContext);
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
                </>
            }
        >
            <TreeSublist
                parentKey={data.name}
                data={data}
                fieldName='trials'
                nameTemplate='New Trial'
                setData={setData}
                newDataCreator={() => {
                    return {
                        createdDate: dayjs().startOf('day'),
                    }
                }}
            >
                {
                    ((showExperiments || !currTrial.trial) ? (data.trials || []) : [currTrial.trial]).map(itemData => (
                        <Trial
                            key={itemData.name}
                            data={itemData}
                            setData={newData => {
                                setData({ ...data, trials: changeByName(data.trials, itemData.name, newData) });
                            }}
                            experimentName={experimentName}
                            trialTypeName={data.name}
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
