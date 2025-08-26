import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Paper } from "@mui/material";
import { TreeView } from "@mui/x-tree-view/TreeView";
import { useContext } from "react";
import { useExperimentProvider } from "../Context/ExperimentProvider";
import { useDeviceSeletion } from "../Context/useDeviceSeletion";
import { DeviceItem } from "../Experiment/DeviceItem";
import { EnclosingListSelectionContext } from "../Experiment/EnclosedSelectionProvider";
import { ScopeEnum } from '../types/ScopeEnum';

export const DeviceTableRich = ({ }) => {
  const {
    selectionOnEnclosingUuids,
    setSelectionOnEnclosingUuids,
  } = useContext(EnclosingListSelectionContext);

  const { selection } = useDeviceSeletion();
  const { currTrial } = useExperimentProvider();

  const shownDevices = [];
  for (const { deviceTypeName, deviceItemName } of selection || []) {
    const deviceType = ((currTrial.experiment || {}).deviceTypes || []).find(x => x.name === deviceTypeName);
    const deviceItem = ((deviceType || {}).devices || []).find(x => x.name === deviceItemName);
    if (deviceType && deviceItem) {
      shownDevices.push({ deviceType, deviceItem, deviceTypeName, deviceItemName });
    }
  };

  return (
    <TreeView
      defaultCollapseIcon={<ExpandMoreIcon />}
      defaultExpandIcon={<ChevronRightIcon />}
      defaultExpanded={shownDevices.map(({ deviceItem }) => deviceItem.trackUuid)}
      multiSelect
      selected={selectionOnEnclosingUuids}
      onNodeSelect={(e, ids) => setSelectionOnEnclosingUuids(ids)}
    >
      {shownDevices.map(({ deviceType, deviceItem }) => (
        <Paper
          key={deviceItem.trackUuid}
          sx={{
            position: 'relative',
            maxHeight: 'fit-content',
            right: '10px',
            top: '5px',
          }}
        >
          <DeviceItem
            data={deviceItem}
            deviceType={deviceType}
            devicesEnclosingList={shownDevices}
            scope={ScopeEnum.SCOPE_TRIAL}
            showAttributes={true}
          />
        </Paper>
      ))}
    </TreeView>
  )
}
