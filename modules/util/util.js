export function utilStringQs(str) {
  let i = 0;  // advance past any leading '?' or '#' characters
  while (i < str.length && (str[i] === '?' || str[i] === '#')) i++;
  str = str.slice(i);

  return str.split('&')
    .reduce(function(obj, pair) {
      const parts = pair.split('=');
      if (parts.length === 2) {
        obj[parts[0]] = (null === parts[1]) ? '' : decodeURIComponent(parts[1]);
      }
      return obj;
    }, {});
}

export function utilQsString(obj, noencode) {
  // encode everything except special characters used in certain hash parameters:
  // "/" in map states, ":", ",", {" and "}" in background
  function softEncode(s) {
    return encodeURIComponent(s)
      .replace(/(%2F|%3A|%2C|%7B|%7D)/g, decodeURIComponent);
  }

  return Object.keys(obj)
    .sort()
    .map(function(key) {
      return encodeURIComponent(key) + '=' + (
        noencode ? softEncode(obj[key]) : encodeURIComponent(obj[key]));
    })
    .join('&');
}

/**
 * a d3.mouse-alike which
 * 1. Only works on HTML elements, not SVG
 * 2. Does not cause style recalculation
 * @param container
 */
export function utilFastMouse(container) {
  const rect = container.getBoundingClientRect();
  const rectLeft = rect.left;
  const rectTop = rect.top;
  const clientLeft = +container.clientLeft;
  const clientTop = +container.clientTop;
  return function(e) {
    return [
      e.clientX - rectLeft - clientLeft,
      e.clientY - rectTop - clientTop,
    ];
  };
}

export function utilFunctor(value) {
  if (typeof value === 'function') return value;
  return function() {
    return value;
  };
}
