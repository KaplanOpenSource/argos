import { changeByName } from "../Utils/utils";
import { TrialType } from "./TrialType";

export const TrialTypesList = ({ data, setData }) => {
    return (data.trialTypes || []).map(itemData => (
        <TrialType
            key={itemData.trackUuid}
            data={itemData}
            setData={newData => {
                setData({ ...data, trialTypes: changeByName(data.trialTypes, itemData.name, newData) });
            }}
            experiment={data}
        />
    ))
}