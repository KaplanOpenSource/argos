import { useExperimentProvider } from "../../Context/ExperimentProvider";
import { useDeviceSeletion } from "../../Context/useDeviceSeletion";
import { useHiddenDeviceTypes } from "../../Context/useHiddenDeviceTypes";
import { RealMapName } from "../../constants/constants";
import { AreaMarkListener } from "../AreaMarkListener";
import { PopupSwitchProvider } from "../PopupSwitchContext";
import { DeviceMarker } from "./DeviceMarker";

export const DeviceMarkersShown = ({ showDeviceNames }) => {
  const { selection, setSelection } = useDeviceSeletion();
  const { currTrial, setTrialData } = useExperimentProvider();
  const { isDeviceTypeHidden } = useHiddenDeviceTypes();

  const mapName = shownMap?.name || RealMapName;

  const shownDevices = (trial?.devicesOnTrial || []).filter(dev => {
    return dev?.location?.coordinates
      && dev?.location?.name === mapName
      && !isDeviceTypeHidden(dev.deviceTypeName);
  });

  return (
    <>
      <PopupSwitchProvider>
        {shownDevices.map((deviceOnTrial, index) => (
          <DeviceMarker
            key={index}
            deviceOnTrial={deviceOnTrial}
            setDeviceOnTrial={newDeviceData => {
              const data = structuredClone(currTrial.trial);
              if (newDeviceData) {
                data.devicesOnTrial[index] = newDeviceData;
              } else {
                data.devicesOnTrial.splice(index, 1);
              }
              setTrialData(data);
            }}
            showDeviceNames={showDeviceNames}
          />
        ))}
      </PopupSwitchProvider>
      <AreaMarkListener
        onAreaMarked={({ boxZoomBounds }) => {
          const newSelection = [...selection];
          for (const { deviceItemName, deviceTypeName, location } of shownDevices) {
            const coordinates = location.coordinates.map(x => parseFloat(x));
            if (boxZoomBounds.contains(coordinates)) {
              const isSelected = newSelection.find(s => {
                return s.deviceItemName === deviceItemName && s.deviceTypeName === deviceTypeName
              });
              if (!isSelected) {
                newSelection.push({ deviceItemName, deviceTypeName });
              }
            }
          }
          setSelection(newSelection);
        }}
      />
    </>
  )
}