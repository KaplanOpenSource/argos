import { useContext } from "react";
import { experimentContext } from "./ExperimentProvider";
import { ExperimentRow } from "./ExperimentRow";
import { Box, List, Typography } from "@mui/material";
import { TreeItem } from '@mui/x-tree-view/TreeItem';
import { TreeView } from '@mui/x-tree-view/TreeView';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { DatePicker } from "@mui/x-date-pickers";
import dayjs from 'dayjs';

export const ExperimentList = ({ }) => {
    const { experiments, setExperiment } = useContext(experimentContext);
    return (
        // <List>
        //     {
        //         experiments.map(e => (
        //             <ExperimentRow key={e.name}
        //                 name={e.name}
        //                 data={e.data}
        //                 setData={newData => setExperiment(e.name, newData)}
        //             />
        //         ))
        //     }
        // </List>
        <TreeView
            defaultCollapseIcon={<ExpandMoreIcon />}
            defaultExpandIcon={<ChevronRightIcon />}
            sx={{ height: 240, flexGrow: 1, maxWidth: 400, overflowY: 'auto' }}
        >
            {
                experiments.map(e => (
                    <TreeItem
                        key={e.name}
                        nodeId={e.name}
                        label={
                            <Box
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    p: 0.5,
                                    pr: 0,
                                }}
                            >
                                {/* <Box component={LabelIcon} color="inherit" sx={{ mr: 1 }} /> */}
                                <Typography variant="body2" sx={{ fontWeight: 'inherit', flexGrow: 1 }}>
                                    {e.name}
                                </Typography>
                                <DatePicker
                                    label="Start Date"
                                    format='DD/MM/YYYY'
                                    value={dayjs(e.data.startDate)}
                                    // onChange={(val) => setData({ ...data, startDate: val })}
                                />
                                <DatePicker
                                    label="End Date"
                                    format='DD/MM/YYYY'
                                    value={dayjs(e.data.endDate)}
                                    // onChange={(val) => setData({ ...data, endDate: val })}
                                />

                                {/* <Typography variant="caption" color="inherit">
                                    {labelInfo}
                                </Typography> */}
                            </Box>
                        }
                    // data={e.data}
                    // setData={newData => setExperiment(e.name, newData)}
                    >

                    </TreeItem>
                ))
            }
            {/* <TreeItem nodeId="1" label="Applications">
                <TreeItem nodeId="2" label="Calendar" />
            </TreeItem>
            <TreeItem nodeId="5" label="Documents">
                <TreeItem nodeId="10" label="OSS" />
                <TreeItem nodeId="6" label="MUI">
                    <TreeItem nodeId="8" label="index.js" />
                </TreeItem>
            </TreeItem> */}
        </TreeView>
    )
}