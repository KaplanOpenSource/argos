import { LatLng } from "leaflet";

export const pos2arr = function (lnglat: { lng: number; lat: number; }): [number, number] {
  return [lnglat.lng, lnglat.lat];
}

export const lerp = function (from: number, to: number, t: number) {
  return from * (1 - t) + to * t;
};

export const lerpYX = function (from: number[], to: number[], t0: number, t1: number) {
  return [lerp(from[0], to[0], t0), lerp(from[1], to[1], t1)];
};

export const lerpPoint = function (from: number[], to: number[], t: number) {
  return lerpYX(from, to, t, t);
};

export const resampleLine = (from: number[], to: number[], num: number) => {
  let ret = new Array(num);
  ret[0] = from;
  for (let i = 1; i < num - 1; ++i) {
    ret[i] = lerpPoint(from, to, i / (num - 1));
  }
  ret[num - 1] = to;
  return ret;
}

export const distance = (p: number[], q: number[]) => {
  const dx = p[0] - q[0];
  const dy = p[1] - q[1];
  return Math.sqrt(dx * dx + dy * dy);
}

export const polylineLength = (points: number[][]) => {
  let total = 0;
  for (let i = 0; i < points.length - 1; ++i) {
    total += distance(points[i], points[i + 1]);
  }
  return total;
}

export const polylineDistance = (latLngs: LatLng[]) => {
  let total = 0;
  for (let i = 0; i < latLngs.length - 1; ++i) {
    total += latLngs[i].distanceTo(latLngs[i + 1]);
  }
  return total;
}

export const distToText = (dist: number) => {
  if (dist >= 1000) return (Math.round(dist / 100) / 10) + "km";
  if (dist >= 100) return Math.round(dist) + "m";
  return (Math.round(dist * 10) / 10) + "m";
}

export const findPositionOnPolyline = (points: number[][], pos: number) => {
  let curr = 0;
  for (let i = 0; i < points.length - 1; ++i) {
    const dist = distance(points[i], points[i + 1]);
    const after = curr + dist;
    if (after <= pos) {
      curr = after;
    } else {
      const fraction = (pos - curr) / dist;
      return lerpPoint(points[i], points[i + 1], fraction);
    }
  }
  return points[points.length - 1];
}

export const resamplePolyline = (points: number[][], num: number) => {
  const total = polylineLength(points);
  let resampled = new Array(num);
  for (let i = 0; i < num; ++i) {
    resampled[i] = findPositionOnPolyline(points, (num > 1 ? (i / (num - 1)) : 0.5) * total);
  }
  // console.log('resamplePolyline:', points, num, resampled);
  return resampled;
}

export const catmullRom = (t: number, p0: number, p1: number, p2: number, p3: number) => {
  var v0 = (p2 - p0) * 0.5;
  var v1 = (p3 - p1) * 0.5;
  var t2 = t * t;
  var t3 = t * t2;
  return (2 * p1 - 2 * p2 + v0 + v1) * t3 + (- 3 * p1 + 3 * p2 - 2 * v0 - v1) * t2 + v0 * t + p1;
}

export const splineCurveOne = (points: number[][], t: number) => {
  var p = (points.length - 1) * t;

  var intPoint = Math.floor(p);
  var weight = p - intPoint;

  var p0 = points[intPoint === 0 ? intPoint : intPoint - 1];
  var p1 = points[intPoint];
  var p2 = points[intPoint > points.length - 2 ? points.length - 1 : intPoint + 1];
  var p3 = points[intPoint > points.length - 3 ? points.length - 1 : intPoint + 2];

  return [
    catmullRom(weight, p0[0], p1[0], p2[0], p3[0]),
    catmullRom(weight, p0[1], p1[1], p2[1], p3[1])
  ];
};

export const splineCurve = (points: number[][], amount: number) => {
  if (points.length <= 2) return points;
  let ret = new Array(amount);
  for (let i = 0; i < amount; ++i) {
    ret[i] = splineCurveOne(points, i / amount);
  }
  return ret;
}

export const arcCurve = (center: number[], radius: number, fromAngle: number, toAngle: number, amount: number) => {
  // console.log(center, radius, fromAngle, toAngle);
  if (toAngle > fromAngle) toAngle -= Math.PI * 2;
  let ret = new Array(amount);
  for (let i = 0; i < amount; ++i) {
    const t = i / (amount - 1);
    const a = fromAngle * (1 - t) + toAngle * t;
    ret[i] = [center[0] + radius * Math.cos(a), center[1] + radius * Math.sin(a)];
  }
  // console.log(ret);
  return ret;
}

export const arcCurveFromPoints = (points: number[][], amount: number) => {
  let curve;
  if (points.length <= 2) {
    curve = [];
  } else {
    const p = points[0], v1 = points[1], v2 = points[points.length - 1];
    const a1 = Math.atan2(v1[1] - p[1], v1[0] - p[0]);
    const a2 = Math.atan2(v2[1] - p[1], v2[0] - p[0]);
    curve = arcCurve(p, distance(p, v1), a1, a2, amount);
  }
  // console.log('arcCurveFromPoints:', points, amount, curve);
  return curve;
}

export const partition = (arr: any[], num: number) => {
  let results = [];
  let leg = Math.ceil(arr.length / num);
  while (arr.length) {
    results.push(arr.splice(0, leg));
  }
  return results;
}

/** @returns Rectangle as an array of its 4 points */
export const rectByAngle = (points: number[][], _angle: number) => {
  // return [p0, [p1[0], p0[1]], p1, [p0[0], p1[1]]];
  return points.concat([points[0], points[0], points[0], points[0]]).slice(0, 4);
}

export const distLatLngPythagoras = (p0: { lat: number; lng: number; }, p1: { lat: number; lng: number; }) => {
  return Math.sqrt(Math.pow(p0.lat - p1.lat, 2) + Math.pow(p0.lng - p1.lng, 2));
}

export const round9 = (n: number) => {
  return Math.round(n * 1e9) / 1e9;
}

export const roundDec = (num: number) => {
  return Math.round(num * 1000) / 1000;
}

export const distXY = (p0: { x: number; y: number; }, p1: { x: number; y: number; }) => {
  return Math.sqrt(Math.pow(p0.x - p1.x, 2) + Math.pow(p0.y - p1.y, 2));
}
