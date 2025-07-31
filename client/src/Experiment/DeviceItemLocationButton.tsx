import { NotListedLocation, NotListedLocationTwoTone, PersonPinCircle, PersonPinCircleTwoTone, Place, PlaceOutlined, PlaceTwoTone } from "@mui/icons-material";
import { ReactNode } from "react";
import { RealMapName } from "../constants/constants";
import { useChosenTrial } from "../Context/useChosenTrial";
import { TrialObj } from "../objects";
import { ButtonTooltip } from "../Utils/ButtonTooltip";
import { ContextMenu } from "../Utils/ContextMenu";

const locationIconTooltip = (
  trial: TrialObj | undefined,
  deviceTypeName: string,
  deviceItemName: string,
  mapName: string,
): { tooltip: string, icon: ReactNode } => {
  const dev = trial?.findDevice({ deviceItemName, deviceTypeName }, false);
  if (dev) {
    if (dev.containedIn) {
      if (dev.location) {
        return { tooltip: 'Has parent but also has own location, click to remove from both', icon: <NotListedLocation /> };
      }
      const recursiveLocation = dev.getLocationRecursive();
      if (recursiveLocation) {
        if (recursiveLocation.name || RealMapName === mapName) {
          return { tooltip: 'Has parent with a location on this map, click to remove from parent', icon: <PersonPinCircle /> };
        } else {
          return { tooltip: 'Has parent with a location on another map, click to remove from parent', icon: <PersonPinCircleTwoTone /> };
        }
      }
      return { tooltip: 'Has parent that has no location, click to remove from parent', icon: <NotListedLocationTwoTone /> };
    } else if (dev.location) {
      if (dev.location.name || RealMapName === mapName) {
        return { tooltip: 'Has location on this map, click to remove location', icon: <Place /> };
      } else {
        return { tooltip: 'Has location on another map, click to remove location', icon: <PlaceTwoTone /> };
      }
    }
  }
  return { tooltip: 'Has no location', icon: <PlaceOutlined /> };
}

export const DeviceItemLocationButton = ({
  deviceType,
  deviceItem,
  surroundingDevices,
}) => {
  const { changeTrialObj, shownMap, isTrialChosen, trial } = useChosenTrial();

  const { tooltip, icon } = locationIconTooltip(trial, deviceType?.name, deviceItem?.name, shownMap?.name || RealMapName);

  const removeLocation = () => {
    changeTrialObj(draft => draft.setDeviceLocation({ deviceTypeName: deviceType?.name, deviceItemName: deviceItem?.name }, undefined));
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
        changeTrialObj(draft => {
          for (const { deviceTypeName, deviceItemName } of surroundingDevices) {
            draft.setDeviceLocation({ deviceTypeName, deviceItemName }, undefined);
          }
        });
      }
    })
  }

  return (
    <>
      {isTrialChosen() && (
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