import { TrialType } from "./TrialType";
import { TreeRow } from "../App/TreeRow";
import { DeviceType } from "./DeviceType";
import { TreeSublist } from "../App/TreeSublist";
import { DateProperty } from "../Utils/DateProperty";
import { IconButton } from "@mui/material";
import DownloadIcon from '@mui/icons-material/Download';
import { downloadJsonFile } from "../Utils/utils";

export const ExperimentRow = ({ data, setData }) => {
    return (
        <TreeRow
            key={data.name}
            data={data}
            setData={setData}
            components={
                <>
                    <DateProperty data={data} setData={setData}
                        label="Start Date"
                        field="startDate"
                    />
                    <DateProperty data={data} setData={setData}
                        label="End Date"
                        field="endDate"
                    />
                    <IconButton
                        onClick={() => {
                            downloadJsonFile(`experiment_${data.name}.json`, data);
                        }}
                    >
                        <DownloadIcon />
                    </IconButton>
                </>
            }
        >

            <TreeSublist
                parentKey={data.name}
                data={data}
                fieldName='trialTypes'
                nameTemplate='New Trial Type'
                setData={setData}
                component={(data1, setData1) => (
                    <TrialType
                        key={data1.name}
                        data={data1}
                        setData={setData1}
                        experimentName={data.name}
                    />
                )}
            />

            <TreeSublist
                parentKey={data.name}
                data={data}
                fieldName='deviceTypes'
                nameTemplate='New Device Type'
                setData={setData}
                component={(data, setData) => (
                    <DeviceType
                        key={data.name}
                        data={data}
                        setData={setData}
                    />
                )}
            />
        </TreeRow>
    )
}
