import { IconButton } from "@mui/material";
import AddIcon from '@mui/icons-material/Add';

import dayjs from 'dayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { TrailSet } from "./TrailSet";
import { TreeRow } from "./TreeRow";

export const ExperimentRow = ({ name, data, setData }) => {
    const newTrialSetName = () => {
        const newName = 'new_trial_set';
        if (!(data.trailSet || []).find(t => t.name === newName)) {
            return newName
        }
        for (let i = 1; ; ++i) {
            if (!(data.trailSet || []).find(t => t.name === newName + '_' + i)) {
                return newName + '_' + i;
            }
        }
    }

    const setTrialSetData = (trialName, trialNewData) => {
        const trailSet = (data.trailSet || []).slice();
        let i = trailSet.findIndex(t => t.name === trialName);
        i = i >= 0 ? i : trailSet.length;
        trailSet[i] = { name: trialName, data: trialNewData };
        setData({ ...data, trailSet });
    }

    return (
        <TreeRow
            key={name}
            name={name}
            data={data}
            setData={setData}
            components={
                <>
                    <DatePicker
                        label="Start Date"
                        format='DD/MM/YYYY'
                        value={dayjs(data.startDate)}
                        onChange={(val) => setData({ ...data, startDate: val })}
                    />
                    <DatePicker
                        label="End Date"
                        format='DD/MM/YYYY'
                        value={dayjs(data.endDate)}
                        onChange={(val) => setData({ ...data, endDate: val })}
                    />
                    <IconButton
                        // edge="start"
                        color="inherit"
                        onClick={() => setTrialSetData(newTrialSetName(), {})}
                    >
                        <AddIcon />
                    </IconButton>
                </>
            }
        >
            {
                (data.trailSet || []).map(e => (
                    <TrailSet
                        key={e.name}
                        name={e.name}
                        data={e.data}
                        setData={newData => setTrialSetData(e.name, newData)}
                    />
                ))
            }
        </TreeRow>
    )
}