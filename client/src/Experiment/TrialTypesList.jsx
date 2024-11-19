import { Typography } from "@mui/material";
import { TreeSublist } from "../App/TreeSublist";
import { changeByName } from "../Utils/utils";
import { TrialType } from "./TrialType";
import { sum } from "lodash";

export const TrialTypesList = ({ data, setData }) => {
    const trialTypes = data?.trialTypes || [];
    const trialsNum = sum(trialTypes.map(x => x?.trials?.length || 0));
    return (
        <TreeSublist
            parentKey={data.trackUuid}
            data={data}
            fieldName='trialTypes'
            nameTemplate='New Trial Type'
            setData={setData}
            newDataCreator={() => {
                return {
                    attributeTypes: [
                        {
                            "type": "Date",
                            "name": "TrialStart",
                        },
                        {
                            "type": "Date",
                            "name": "TrialEnd",
                        },
                    ]
                }
            }}
            textOnRow={trialsNum + ' Trials'}
        >
            {trialTypes.map(itemData => (
                <TrialType
                    key={itemData.trackUuid}
                    data={itemData}
                    setData={newData => {
                        setData({ ...data, trialTypes: changeByName(data.trialTypes, itemData.name, newData) });
                    }}
                    experiment={data}
                />
            ))}
        </TreeSublist>
    )
}