import { useChosenTrial } from "../Context/useChosenTrial";
import { useDeviceSeletion } from "../Context/useDeviceSeletion";
import { useShape } from "../EditToolBox/ShapeContext";
import { CHOOSE_SHAPE, FREEPOSITIONING_SHAPE, POINT_SHAPE } from "../EditToolBox/utils/constants";
import { ICoordinates } from "../types/types";
import { MapContextMenu } from "./MapContextMenu";
import { MapEventer } from "./MapEventer";
import { MarkedShape } from "./MarkedShape";

export const MapPlacer = ({
  markedPoints,
  setMarkedPoints,
}) => {
  const { selection, setSelection } = useDeviceSeletion();
  const { shape, shapeData } = useShape();
  const { changeTrialObj, shownMap } = useChosenTrial();

  const onMapClick = (e, mapObj) => {
    const latlng: ICoordinates = [e.latlng.lat, e.latlng.lng];
    if (!shapeData.noControlPoints) {
      if (!shapeData.maxPoints) {
        setMarkedPoints([...markedPoints, latlng]);
      } else {
        setMarkedPoints([...markedPoints.slice(0, shapeData.maxPoints - 1), latlng]);
      }
    } else {
      if (shape === FREEPOSITIONING_SHAPE) {
        if (selection.length > 0) {
          changeTrialObj(draft => {
            draft.setDeviceLocation(selection[0], latlng, shownMap?.name);
          })
          setSelection(selection.slice(1));
        }
      } else if (shape === POINT_SHAPE) {
        if (selection.length > 0) {
          changeTrialObj(draft => {
            for (const s of selection) {
              draft.setDeviceLocation(s, latlng, shownMap?.name);
            }
          })
          setSelection([]);
        }
      } else if (shape === CHOOSE_SHAPE) {
        var tooltip = L.tooltip({ direction: 'top', content: 'Nothing to choose here', }).setLatLng(latlng)
        mapObj.openTooltip(tooltip);
        setTimeout(() => {
          mapObj.closeTooltip(tooltip);
        }, 500);
      }
    }
  }

  return (
    <>
      <MapEventer
        mapEvents={{ click: onMapClick }}
        directlyOnMap={true}
      />
      <MarkedShape
        markedPoints={markedPoints}
        setMarkedPoints={setMarkedPoints}
        entityNum={selection.length}
      // distanceInMeters={showDistanceInMeters}
      />
      <MapContextMenu
        menuItems={[
          {
            label: 'Place top point here',
            callback: (_e: any, latlng) => {
              if (selection.length > 0) {
                changeTrialObj(draft => draft.findDevice(selection[0])?.setLocationOnMap(latlng, shownMap?.name));
                setSelection(selection.slice(1));
              }
            }
          }
        ]}
      />
    </>
  )
}