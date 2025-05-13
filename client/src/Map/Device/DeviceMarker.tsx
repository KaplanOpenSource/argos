import { useEffect, useRef } from "react";
import { Marker, Popup, Tooltip } from "react-leaflet";
import { RealMapName } from "../../constants/constants";
import { useExperimentProvider } from "../../Context/ExperimentProvider";
import { useCurrTrial } from "../../Context/useCurrTrial";
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
  setDeviceOnTrial,
  showDeviceNames,
}: {
  deviceOnTrial: IDeviceOnTrial,
  setDeviceOnTrial: (newData: IDeviceOnTrial) => void,
  showDeviceNames: boolean,
}) => {
  const { selection, setSelection } = useDeviceSeletion();
  const { currTrial } = useExperimentProvider();
  const { trial } = useCurrTrial({});

  const ref = useRef(null);
  const { isPopupSwitchedTo } = usePopupSwitch();
  const { shape } = useShape();

  useEffect(() => {
    if (isPopupSwitchedTo(deviceOnTrial.deviceTypeName + ' : ' + deviceOnTrial.deviceItemName)) {
      ref.current.openPopup();
    }
  })

  const { location, deviceTypeName, deviceItemName } = deviceOnTrial || {};
  const { coordinates } = location || {};
  if (!coordinates) return null;

  const setLocation = (latlng) => {
    const dlat = latlng.lat - coordinates[0];
    const dlng = latlng.lng - coordinates[1];
    trial.batch(draft => {
      draft.getDevicesByNames(selection).forEach(devSelect => {
        if (devSelect.hasLocationOnMap(currTrial.shownMapName)) {
          const coordSelect = devSelect.getLocation()?.coordinates;
          if (coordSelect) {
            devSelect.setLocationOnMap([coordSelect[0] + dlat, coordSelect[1] + dlng], currTrial.shownMapName);
          }
        }
      })
      const devDrag = draft.getDevice(deviceTypeName, deviceItemName);
      devDrag.setLocationOnMap([latlng.lat, latlng.lng], currTrial.shownMapName);
    })
  }

  const isSelected = selection.find(s => s.deviceItemName === deviceItemName && s.deviceTypeName === deviceTypeName);

  const deviceType = currTrial.experiment.deviceTypes.find(dt => dt.name === deviceTypeName);

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
          // e.target.closeTooltip();
          setLocation(e.target.getLatLng());
        },
        drag: e => {
          const tooltipMarkerEl = document.getElementById('tooltip-marker');
          if (tooltipMarkerEl) {
            tooltipMarkerEl.textContent = locationToStr({ coordinates: [e.latlng.lat, e.latlng.lng] });
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
          setDeviceOnTrial={setDeviceOnTrial}
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