import L, { LatLng } from "leaflet";
import { useEffect, useRef } from "react";
import { Marker, Popup, Tooltip } from "react-leaflet";
import { RealMapName } from "../../constants/constants";
import { useExperimentProvider } from "../../Context/ExperimentProvider";
import { useChosenTrial } from "../../Context/useChosenTrial";
import { useDeviceSeletion } from "../../Context/useDeviceSeletion";
import { useShape } from "../../EditToolBox/ShapeContext";
import { SELECT_SHAPE } from "../../EditToolBox/utils/constants";
import { IDeviceOnTrial } from "../../types/types";
import { round9, roundDec } from "../../Utils/GeometryUtils";
import { usePopupSwitch } from "../PopupSwitchContext";
import { DeviceMarkerIcon } from "./DeviceMarkerIcon";
import { DirectionArrow } from "./DirectionArrow";
import { SingleDevicePropertiesView } from "./SingleDevicePropertiesView";

export const locationToStr = (location) => {
  const { coordinates } = location || {};
  if (location?.name === RealMapName || !location?.name) {
    return `lat: ${round9(coordinates[0])}, lng: ${round9(coordinates[1])}`;
  } else {
    return `x: ${roundDec(coordinates[1])}, y: ${roundDec(coordinates[0])}`;
  }
}

export const DeviceMarker = ({
  deviceOnTrial,
  showDeviceNames,
}: {
  deviceOnTrial: IDeviceOnTrial,
  showDeviceNames: boolean,
}) => {
  const { selection, setSelection } = useDeviceSeletion();
  const { currTrial } = useExperimentProvider();
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
  if (!coordinates) return null;

  const setLocation = (latlng: LatLng) => {
    const dlat = latlng.lat - coordinates[0];
    const dlng = latlng.lng - coordinates[1];
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

  const isSelected = !!selection.find(s => s.deviceItemName === deviceItemName && s.deviceTypeName === deviceTypeName);

  const deviceType = currTrial?.experiment?.deviceTypes?.find(dt => dt.name === deviceTypeName);

  const icon = DeviceMarkerIcon({ iconName: deviceType?.icon, deviceItemName, isSelected, showDeviceNames });

  const direction = deviceOnTrial.attributes?.find(a => a.name === 'direction');

  return (
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
          {locationToStr(location)}
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
      {direction === undefined ? null : (
        <DirectionArrow
          deviceOnTrial={deviceOnTrial}
        />
      )}
    </Marker>
  )
}