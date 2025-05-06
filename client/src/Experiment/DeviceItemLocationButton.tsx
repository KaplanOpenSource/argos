import { NotListedLocation, NotListedLocationTwoTone, PersonPinCircle, PersonPinCircleTwoTone, Place, PlaceOutlined, PlaceTwoTone } from "@mui/icons-material";
import React, { ReactNode } from "react";
import { RealMapName } from "../constants/constants";
import { DeviceObject } from "../Context/DeviceObject";
import { useExperimentProvider } from "../Context/ExperimentProvider";
import { useCurrTrial } from "../Context/useCurrTrial";
import { ButtonTooltip } from "../Utils/ButtonTooltip";
import { ContextMenu } from "../Utils/ContextMenu";

const locationIconTooltip = (device: DeviceObject, mapName: string): { tooltip: string, icon: ReactNode } => {
  const hasLocation = device.hasLocation();
  const hasLocationOnMap = hasLocation && device.hasLocationOnMap(mapName);
  const hasLocationSelf = hasLocation && device.hasLocation(false);
  const hasParent = device.hasParent();

  if (hasParent) {
    if (hasLocationSelf) {
      return { tooltip: 'Has parent but also has own location, click to remove from both', icon: <NotListedLocation /> };
    }
    if (hasLocationOnMap) {
      return { tooltip: 'Has parent with a location on this map, click to remove from parent', icon: <PersonPinCircle /> };
    }
    if (hasLocation) {
      return { tooltip: 'Has parent with a location on another map, click to remove from parent', icon: <PersonPinCircleTwoTone /> };
    }
    return { tooltip: 'Has parent that has no location, click to remove from parent', icon: <NotListedLocationTwoTone /> };
  }
  if (hasLocation) {
    if (hasLocationOnMap) {
      return { tooltip: 'Has location on this map, click to remove location', icon: <Place /> };
    } else if (hasLocation) {
      return { tooltip: 'Has location on another map, click to remove location', icon: <PlaceTwoTone /> };
    }
  }
  return { tooltip: 'Has no location', icon: <PlaceOutlined /> };
}

export const DeviceItemLocationButton = ({
  deviceType,
  deviceItem,
  surroundingDevices,
}) => {
  const { currTrial } = useExperimentProvider();

  const { trial } = useCurrTrial({});
  const device = trial.getDevice(deviceType?.name, deviceItem?.name);

  const { tooltip, icon } = locationIconTooltip(device, currTrial?.shownMapName || RealMapName);

  const removeLocation = () => {
    device.setLocation(undefined);
  }

  const menuItems = [
    {
      label: 'Remove location',
      callback: removeLocation
    },
  ];

  if (surroundingDevices) {
    menuItems.push({
      label: 'Remove locations to all devices in list',
      callback: () => {
        trial.batch(draft => {
          for (const { deviceTypeName, deviceItemName } of surroundingDevices) {
            const dev = draft.getDevice(deviceTypeName, deviceItemName);
            dev.setLocation(undefined);
          }
        });
      }
    })
  }

  return (
    <>
      {currTrial.trial && (
        <ContextMenu menuItems={menuItems}>
          <ButtonTooltip
            tooltip={tooltip}
            onClick={removeLocation}
          // disabled={!hasLocation}
          >
            {icon}
          </ButtonTooltip>
        </ContextMenu>
      )}
    </>
  )
}