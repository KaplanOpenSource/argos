import { IconButton } from "@mui/material";
import AddIcon from '@mui/icons-material/Add';

import dayjs from 'dayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { TrailSet } from "./TrailSet";
import { TreeRow } from "./TreeRow";
import { EntityType } from "./EntityType";

export const ExperimentRow = ({ name, data, setData }) => {
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

            <TreeSublist
                data={data}
                fieldName='trailSet'
                nameTemplate='new_trial_set'
                setData={setData}
                component={(name, data, setData) => (
                    <TrailSet
                        key={name}
                        name={name}
                        data={data}
                        setData={setData}
                    />
                )}
            />

            <TreeSublist
                data={data}
                fieldName='entityTypes'
                nameTemplate='new_entity_type'
                setData={setData}
                component={(name, data, setData) => (
                    <EntityType
                        key={name}
                        name={name}
                        data={data}
                        setData={setData}
                    />
                )}
            />
        </TreeRow>
    )
}

export const TreeSublist = ({ nameTemplate, fieldName, data, setData, component }) => {
    const items = data[fieldName] || [];
    const setItems = val => {
        setData({ ...data, [fieldName]: val });
    }

    const newName = () => {
        if (!items.find(t => t.name === nameTemplate)) {
            return nameTemplate
        }
        for (let i = 1; ; ++i) {
            if (!items.find(t => t.name === nameTemplate + '_' + i)) {
                return nameTemplate + '_' + i;
            }
        }
    }

    const setItemData = (theName, theData) => {
        const theItems = (items || []).slice();
        let i = theItems.findIndex(t => t.name === theName);
        i = i >= 0 ? i : theItems.length;
        theItems[i] = { name: theName, data: theData };
        setItems(theItems);
    }

    return (
        <>
            <IconButton
                color="inherit"
                onClick={() => setItemData(newName(), {})}
            >
                <AddIcon />
            </IconButton>
            {
                items.map(e => (
                    component(e.name, e.data, newData => setItemData(e.name, newData))
                ))
            }
        </>
    )
}