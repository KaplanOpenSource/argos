import { Box, IconButton, Typography } from "@mui/material";
import AddIcon from '@mui/icons-material/Add';

import dayjs from 'dayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { TrailSet } from "./TrailSet";
import { TreeRow } from "./TreeRow";
import { EntityType } from "./EntityType";
import { TreeSublist } from "./TreeSublist";

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
