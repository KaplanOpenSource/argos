import L, { LatLng } from "leaflet";
import { useEffect, useRef } from "react";
import { Marker, Popup, Tooltip } from "react-leaflet";
import { RealMapName } from "../../constants/constants";
import { useChosenTrial } from "../../Context/useChosenTrial";
import { useDeviceSeletion } from "../../Context/useDeviceSeletion";
import { useShape } from "../../EditToolBox/ShapeContext";
import { SELECT_SHAPE } from "../../EditToolBox/utils/constants";
import { DeviceOnTrialObj } from "../../objects";
import { ILocation } from "../../types/types";
import { round9, roundDec } from "../../Utils/GeometryUtils";
import { usePopupSwitch } from "../PopupSwitchContext";
import { DeviceMarkerIcon } from "./DeviceMarkerIcon";
import { DirectionArrow } from "./DirectionArrow";
import { SingleDevicePropertiesView } from "./SingleDevicePropertiesView";

export const locationToStr = (location: ILocation) => {
  const { coordinates } = location || {};
  if (!location || !coordinates) {
    return `no location`;
  } else if (location?.name === RealMapName || !location?.name) {
    return `lat: ${round9(coordinates[0])}, lng: ${round9(coordinates[1])}`;
  } else {
    return `x: ${roundDec(coordinates[1])}, y: ${roundDec(coordinates[0])}`;
  }
}

export const DeviceMarker = ({
  deviceOnTrial,
  showDeviceNames,
}: {
  deviceOnTrial: DeviceOnTrialObj,
  showDeviceNames: boolean,
}) => {
  const { selection, setSelection } = useDeviceSeletion();
  const { changeTrialObj, shownMap } = useChosenTrial();

  const ref = useRef<L.Marker>(null);
  const { isPopupSwitchedTo } = usePopupSwitch();
  const { shape } = useShape();

  useEffect(() => {
    if (isPopupSwitchedTo(deviceOnTrial.deviceTypeName + ' : ' + deviceOnTrial.deviceItemName)) {
      ref?.current?.openPopup();
    }
  })

  const { location, deviceTypeName, deviceItemName } = deviceOnTrial || {};
  const { coordinates } = location || {};

  const setLocation = (latlng: LatLng) => {
    const dlat = latlng.lat - coordinates![0];
    const dlng = latlng.lng - coordinates![1];
    changeTrialObj(draft => {
      for (const s of selection) {
        const dev = draft.findDevice(s, false);
        const coords = dev?.location?.coordinates;
        if (coords) {
          dev.setLocationOnMap([coords[0] + dlat, coords[1] + dlng], shownMap?.name);
        }
      }
      draft.setDeviceLocation(deviceOnTrial, [latlng.lat, latlng.lng], shownMap?.name);
    });
  }

  const isSelected = !!selection.find(s => deviceOnTrial.isSame(s));

  const icon = DeviceMarkerIcon({
    iconName: deviceOnTrial.deviceItem.deviceType.icon,
    deviceItemName,
    isSelected,
    showDeviceNames,
  });

  return coordinates
    ? (
      <Marker
        key={deviceTypeName + '_' + deviceItemName}
        position={coordinates}
        ref={ref}
        draggable={true}
        icon={icon}
        eventHandlers={{
          dragend: e => {
            setLocation(e.target.getLatLng());
          },
          drag: e => {
            const tooltipMarkerEl = document.getElementById('tooltip-marker');
            if (tooltipMarkerEl) {
              const latlng = e.target.getLatLng();
              tooltipMarkerEl.textContent = locationToStr({ coordinates: [latlng.lat, latlng.lng] });
            }
          },
          click: () => {
            if (shape === SELECT_SHAPE) {
              const selectedIndex = selection.findIndex(t => {
                return t.deviceTypeName === deviceTypeName && t.deviceItemName === deviceItemName;
              });
              if (selectedIndex !== -1) {
                setSelection(selection.filter((_, i) => i !== selectedIndex));
              } else {
                setSelection([...selection, { deviceTypeName, deviceItemName }]);
              }
            }
          },
        }}
      >
        <Tooltip>
          {showDeviceNames ? null : (
            <>
              {deviceItemName}
              < br />
            </>
          )}
          <span id="tooltip-marker">
            {locationToStr(location!)}
          </span>
        </Tooltip>
        <Popup
          offset={[-3, -15]}
        >
          <SingleDevicePropertiesView
            deviceOnTrial={deviceOnTrial}
          >
          </SingleDevicePropertiesView>
        </Popup>
        {deviceOnTrial.attributes?.find(a => a.name === 'direction') === undefined
          ? null
          : (
            <DirectionArrow
              deviceOnTrial={deviceOnTrial}
            />
          )}
      </Marker>
    )
    : null
}