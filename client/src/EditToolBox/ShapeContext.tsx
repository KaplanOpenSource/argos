import React, { createContext, useContext } from 'react';
import { arcCurveFromPoints, lerpPoint, rectByAngle, resamplePolyline, splineCurve } from '../Utils/GeometryUtils';
import { CHOOSE_SHAPE, FREEPOSITIONING_SHAPE, POINT_SHAPE, SELECT_SHAPE } from './utils/constants.js';

export const ShapeContext = createContext(null)

export const useShape = () => useContext(ShapeContext);

export const ShapeProvider = ({ children }) => {
  const [shape, setShape] = React.useState(SELECT_SHAPE);
  const [rectAngle, setRectAngle] = React.useState(0);
  const [rectRows, setRectRows] = React.useState(3);

  const shapeOptions = [
    {
      name: CHOOSE_SHAPE,
      noControlPoints: true,
      toLine: points => [],
      toPositions: (points, amount) => []
    },
    {
      name: SELECT_SHAPE,
      noControlPoints: true,
      toLine: points => [],
      toPositions: (points, amount) => []
    },
    {
      name: FREEPOSITIONING_SHAPE,
      noControlPoints: true,
      toLine: points => [],
      toPositions: (points, amount) => amount && points.length ? [points[0]] : []
    },
    {
      name: POINT_SHAPE,
      noControlPoints: true,
      toLine: points => [],
      toPositions: (points, amount) => amount && points.length ? [points[0]] : []
    },
    {
      name: 'Poly',
      toLine: points => [points],
      toPositions: (points, amount) => resamplePolyline(points, amount)
    },
    {
      name: 'Curve',
      toLine: points => [splineCurve(points, 100)],
      toPositions: (points, amount) => resamplePolyline(splineCurve(points, 100), amount)
    },
    {
      name: 'Arc',
      maxPoints: 3,
      toLine: points => {
        if (points.length <= 2) return [points];
        const arc = arcCurveFromPoints(points, 400);
        return [[points[0], arc[0]], arc];
      },
      toPositions: (points, amount) => resamplePolyline(arcCurveFromPoints(points, 400), amount)
    },
    {
      name: 'Rect',
      toLine: (points, angle = rectAngle) => {
        const [nw, ne, se, sw] = rectByAngle(points, angle);
        return [[nw, ne, se, sw, nw]];
      },
      toPositions: (points, amount, rows = rectRows, angle = rectAngle) => {
        if (points.length === 0) return [];
        const [nw, ne, se, sw] = rectByAngle(points, angle);
        let ret = [];
        const cols = Math.ceil(amount / rows);
        if (rows > 1 && cols > 1) {
          for (let y = 0; y < rows; ++y) {
            const west = lerpPoint(nw, sw, y / (rows - 1));
            const east = lerpPoint(ne, se, y / (rows - 1));
            for (let x = 0; x < cols; ++x) {
              ret.push(lerpPoint(west, east, x / (cols - 1)));
            }
          }
        }
        return ret;
      }
    }
  ];

  // TODO: get default shapeData in a nicer way, maybe convert shapeOptions to struct
  const shapeData = shapeOptions.find(s => s.name === shape) || shapeOptions.find(s => s.name === CHOOSE_SHAPE);

  const store = {
    shape, setShape,
    rectAngle, setRectAngle,
    rectRows, setRectRows,
    shapeOptions, shapeData
  }

  return <ShapeContext.Provider value={store}>
    {children}
  </ShapeContext.Provider>
}
