import { IconButton } from "@mui/material";
import AddIcon from '@mui/icons-material/Add';

import dayjs from 'dayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { TrailSet } from "./TrailSet";
import { TreeRow } from "./TreeRow";
import { EntityType } from "./EntityType";

export const ExperimentRow = ({ name, data, setData }) => {
    const newName = (items, nameTemplate) => {
        if (!(items || []).find(t => t.name === nameTemplate)) {
            return nameTemplate
        }
        for (let i = 1; ; ++i) {
            if (!(items || []).find(t => t.name === nameTemplate + '_' + i)) {
                return nameTemplate + '_' + i;
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

    const setEntityTypeData = (theName, theData) => {
        const entityTypes = (data.entityTypes || []).slice();
        let i = entityTypes.findIndex(t => t.name === theName);
        i = i >= 0 ? i : entityTypes.length;
        entityTypes[i] = { name: theName, data: theData };
        setData({ ...data, entityTypes });
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
                </>
            }
        >
            <IconButton
                color="inherit"
                onClick={() => setTrialSetData(newName(data.trailSet, 'new_trial_set'), {})}
            >
                <AddIcon />
            </IconButton>
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
            <IconButton
                color="inherit"
                onClick={() => setEntityTypeData(newName(data.entityTypes, 'new_entity_type'), {})}
            >
                <AddIcon />
            </IconButton>
            {
                (data.entityTypes || []).map(e => (
                    <EntityType
                        key={e.name}
                        name={e.name}
                        data={e.data}
                        setData={newData => setEntityTypeData(e.name, newData)}
                    />
                ))
            }
        </TreeRow>
    )
}