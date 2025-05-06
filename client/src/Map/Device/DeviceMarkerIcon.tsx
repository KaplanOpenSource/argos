import { divIcon } from "leaflet";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { IconDeviceByName } from "../../Icons/IconPicker";

export const DeviceMarkerIcon = ({
  iconName,
  deviceItemName,
  isSelected,
  showDeviceNames,
}: {
  iconName: string,
  deviceItemName: string,
  isSelected: boolean,
  showDeviceNames: boolean,
}) => {
  return divIcon({
    className: 'argos-leaflet-div-icon',
    iconSize: [20, 20],
    iconAnchor: [10, 22],
    html: renderToStaticMarkup(
      <div>
        <IconDeviceByName
          iconName={iconName}
          size="xl"
          color={isSelected ? '#297A31' : '#1B2C6F'}
        />
        {!showDeviceNames ? null :
          <span style={{ backgroundColor: "#fafa44", marginTop: 5, padding: 3, borderColor: "black", color: '#ff4466' }}>
            {deviceItemName.replace(/ /g, '\u00a0')}
          </span>
        }
      </div>
    )
  });
}