import { useChosenTrial } from "../../Context/useChosenTrial";
import { useDeviceSeletion } from "../../Context/useDeviceSeletion";
import { useHiddenDeviceTypes } from "../../Context/useHiddenDeviceTypes";
import { RealMapName } from "../../constants/constants";
import { ICoordinates } from "../../types/types";
import { AreaMarkListener } from "../AreaMarkListener";
import { PopupSwitchProvider } from "../PopupSwitchContext";
import { DeviceMarker } from "./DeviceMarker";

export const DeviceMarkersShown = ({
  showDeviceNames,
}: {
  showDeviceNames: boolean,
}) => {
  const { selection, setSelection } = useDeviceSeletion();
  const { trial, shownMap } = useChosenTrial();
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
            showDeviceNames={showDeviceNames}
          />
        ))}
      </PopupSwitchProvider>
      <AreaMarkListener
        onAreaMarked={({ boxZoomBounds }) => {
          const newSelection = [...selection];
          for (const { deviceItemName, deviceTypeName, location } of shownDevices) {
            const coordinates = location!.coordinates!.map(x => parseFloat(x + '')) as ICoordinates;
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