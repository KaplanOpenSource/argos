import { useContext } from "react";
import { TreeRow } from "../App/TreeRow";
import { TreeSublist } from "../App/TreeSublist";
import { DateProperty } from "../Property/DateProperty";
import { Stack } from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import PublicIcon from '@mui/icons-material/Public';
import { changeByName } from "../Utils/utils";
import { useExperimentProvider } from "../Context/ExperimentProvider";
import { ImageStandalone } from "./ImageStandalone";
import { ImageEmbedded } from "./ImageEmbedded";
import { TextFieldDebounceOutlined } from "../Utils/TextFieldDebounce";
import { ButtonTooltip } from "../Utils/ButtonTooltip";
import { DeviceTypesList } from "./DeviceTypesList";
import { TrialTypesList } from "./TrialTypesList";
import { ShapeList } from "./Shape/ShapeList";
import { useShownMap } from "../Context/useShownMap";
import { DownloadExperimentButton } from "../IO/DownloadExperimentButton";

export const ExperimentRow = ({ data, setData, children }) => {
    const { deleteExperiment, currTrial } = useExperimentProvider();
    const { switchToMap } = useShownMap({});
    return (
        <TreeRow
            data={data}
            setData={setData}
            boldName={data === currTrial.experiment}
            components={
                <>
                    <DateProperty
                        data={data.startDate}
                        setData={val => setData({ ...data, startDate: val })}
                        label="Start Date"
                    />
                    <DateProperty
                        data={data.endDate}
                        setData={val => setData({ ...data, endDate: val })}
                        label="End Date"
                    />
                    <DownloadExperimentButton
                        experiment={data}
                    />
                    <ButtonTooltip
                        tooltip={"Delete experiment"}
                        onClick={() => deleteExperiment(data.name)}
                    >
                        <DeleteIcon />
                    </ButtonTooltip>
                    {children}
                </>
            }
        >
            <Stack direction='column' alignItems="stretch" sx={{ paddingRight: '5px' }}>
                <TextFieldDebounceOutlined
                    label="Description"
                    value={data.description}
                    onChange={val => setData({ ...data, description: val })}
                    multiline={true}
                    rows={2}
                />
            </Stack>

            <TrialTypesList
                data={data}
                setData={setData}
            />


            <DeviceTypesList
                data={data}
                setData={setData}
            />

            <TreeSublist
                parentKey={data.trackUuid}
                data={data}
                fieldName='imageEmbedded'
                nameTemplate='New Embedded Image'
                setData={setData}
                components={
                    <ButtonTooltip
                        tooltip={'Switch to show real geographic map'}
                        onClick={() => switchToMap(undefined)}
                    >
                        <PublicIcon />
                    </ButtonTooltip>
                }
            >
                {
                    (data.imageEmbedded || []).map(itemData => (
                        <ImageEmbedded
                            key={itemData.name}
                            data={itemData}
                            setData={newData => {
                                setData({ ...data, imageEmbedded: changeByName(data.imageEmbedded, itemData.name, newData) });
                            }}
                            experiment={data}
                        />
                    ))
                }
            </TreeSublist>

            <TreeSublist
                parentKey={data.trackUuid}
                data={data}
                fieldName='imageStandalone'
                nameTemplate='New Standalone Image'
                setData={setData}
            >
                {
                    (data.imageStandalone || []).map(itemData => (
                        <ImageStandalone
                            key={itemData.name}
                            data={itemData}
                            setData={newData => {
                                setData({ ...data, imageStandalone: changeByName(data.imageStandalone, itemData.name, newData) });
                            }}
                            experiment={data}
                        />
                    ))
                }
            </TreeSublist>

            <ShapeList
                data={data}
                setData={setData}
            />

        </TreeRow>
    )
}
