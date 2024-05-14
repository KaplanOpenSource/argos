import { changeByName } from "../Utils/utils";
import { TrialType, trialTypeKey } from "./TrialType";

export const TrialTypesList = ({ data, setData }) => {
    return (data.trialTypes || []).map(itemData => (
        <TrialType
            key={trialTypeKey(data, itemData)}
            data={itemData}
            setData={newData => {
                setData({ ...data, trialTypes: changeByName(data.trialTypes, itemData.name, newData) });
            }}
            experiment={data}
        />
    ))

}