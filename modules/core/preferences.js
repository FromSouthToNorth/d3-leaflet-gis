let _storage;
try {
  _storage = localStorage;
}
catch (e) {
} // eslint-disable-line no-empty
_storage = _storage || (() => {
  let s = {};
  return {
    getItem: (k) => s[k],
    setItem: (k, v) => s[k] = v,
    removeItem: (k) => delete s[k],
  };
})();

const _listeners = {};

function corePreferences(k, v) {
  try {
    if (v === undefined) return _storage.getItem(k);
    else if (v === null) _storage.removeItem(k);
    else _storage.setItem(k, v);
    if (_listeners[k]) {
      _listeners[k].forEach(handler => handler(v));
    }
    return true;
  }
  catch (e) {
    /* eslint-disable no-console */
    if (typeof console !== 'undefined') {
      console.error('localStorage quota exceeded');
    }
    /* eslint-enable no-console */
    return false;
  }
}

corePreferences.onChange = function(k, handler) {
  _listeners[k] = _listeners[k] || [];
  _listeners[k].push(handler);
};

export { corePreferences as prefs };