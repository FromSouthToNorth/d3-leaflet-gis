
// vector addition
export function geoVecAdd(a, b) {
  return [a[0] + b[0], a[1] + b[1]];
}

export function geoVecLength(a, b) {
  return Math.sqrt(geoVecLengthSquare(a, b));
}

export function geoVecLengthSquare(a, b) {
  b = b || [0, 0];
  const x = a[0] - b[0];
  const y = a[1] - b[1];
  return (x * x) + (y * y);
}
