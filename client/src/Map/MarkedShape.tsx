import React from 'react';
import { CircleMarker, Polyline } from "react-leaflet";
import { useShape } from '../EditToolBox/ShapeContext';
import { distToText, polylineDistance, polylineLength } from '../Utils/GeometryUtils';
import { MarkedPoint } from './MarkedPoint';

export const MarkedShape = ({ markedPoints, setMarkedPoints, deviceNum, distanceInMeters }) => {
  const currPolyline = React.useRef(null);
  const auxPolyline = React.useRef(null);

  const { shape, shapeData } = useShape();

  let candLocs = shapeData.toPositions(markedPoints, deviceNum).filter(x => x);

  const setLatLngsWithDist = (leafletElement, points) => {
    leafletElement.setLatLngs(points);
    const latlngs = leafletElement.getLatLngs();
    let dist;
    if (distanceInMeters) {
      const points = latlngs.map(loc => [loc.lng, loc.lat]);
      dist = polylineLength(points);
    } else {
      dist = polylineDistance(latlngs);
    }
    if (dist > 0) {
      leafletElement.bindTooltip(distToText(dist), { permanent: true }).openTooltip();
    }
  };

  const unbindTooltip = (element) => {
    if (element && element.current && element.current && element.current.unbindTooltip) {
      element.current.unbindTooltip();
    }
  };

  const renderShape = (points) => {
    points = points || markedPoints;
    let shownPolylines = undefined;
    if (points.length) {
      shownPolylines = shapeData.toLine(points);
    }
    if (!shownPolylines || !shownPolylines.length) {
      unbindTooltip(currPolyline);
      unbindTooltip(auxPolyline);
      return;
    }
    setLatLngsWithDist(currPolyline.current, shownPolylines[0]);
    if (shape === 'Arc') {
      setLatLngsWithDist(auxPolyline.current, shownPolylines.length > 1 ? shownPolylines[1] : []);
    }
  };


  const replacePoint = (points, i, newPoint) => {
    const newPoints = points.slice();
    newPoints[i] = newPoint;
    return newPoints;
  }

  React.useEffect(() => {
    renderShape();
  });

  return (
    <>
      {
        shapeData.noControlPoints ? null :
          markedPoints.map((p, i) => (
            <MarkedPoint
              key={i}
              location={p}
              setLocation={(latlng) => {
                setMarkedPoints(replacePoint(markedPoints, i, latlng));
              }}
              dragLocation={(latlng) => {
                renderShape(replacePoint(markedPoints, i, latlng));
              }}
            ></MarkedPoint>
          ))
      }
      <Polyline positions={[]} ref={currPolyline} key='poly' />
      {
        shape !== 'Arc' ? null :
          <Polyline positions={[]} ref={auxPolyline} key='poly2' />
      }
      {
        candLocs.map((loc, index) => {
          return <CircleMarker
            key={index}
            center={loc}
            radius={7}
            color={'#297A31'}
            opacity={0.7}
            dashArray={'4 4'}
            weight={2}
          />
        })
      }
    </>
  )
}