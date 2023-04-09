import _throttle from 'lodash-es/throttle.js';

import { prefs } from '../core/preferences.js';
import { utilObjectOmit, utilQsString, utilStringQs } from '../util/index.js';

export function behaviorHash(context) {
  let _cachedHash = null;
  let _latitudeLimit = 90 - 1e-8;

  function computedHashParameters() {
    const map = context.map();
    const center = map.center();
    const zoom = map.zoom();
    const precision = Math.max(0, Math.ceil(Math.log(zoom) / Math.LN2));
    const oldParams = utilObjectOmit(utilStringQs(window.location.hash),
      ['comment', 'source', 'hashtags', 'walkthrough']);
    let newParams = {};

    newParams.map = zoom.toFixed(2) +
      '/' + center[1].toFixed(precision) +
      '/' + center[0].toFixed(precision);
    return Object.assign(oldParams, newParams);
  }

  function computedHash() {
    return '#' + utilQsString(computedHashParameters(), true);
  }

  function updateHashIfNeeded() {
    const latestHash = computedHash();
    if (_cachedHash !== latestHash) {
      _cachedHash = latestHash;

      window.history.replaceState(null, null, latestHash);

      const q = utilStringQs(latestHash);
      if (q.map) {
        prefs('map-location', q.map);
      }
    }
  }

  const _throttledUpdate = _throttle(updateHashIfNeeded, 500);

  function hashchange() {
    if (window.location.hash === _cachedHash) return;

    _cachedHash = window.location.hash;

    const q = utilStringQs(_cachedHash);
    const mapArgs = (q.map || '').split('/').map(Number);
    if (mapArgs.length < 3 || mapArgs.some(isNaN)) {
      updateHashIfNeeded();
    }
    else {
      if (_cachedHash === computedHash()) return;

      context.map().centerZoom([Math.min(_latitudeLimit, Math.max(-_latitudeLimit, mapArgs[1])), mapArgs[2]], mapArgs[0]);
    }
  }

  function behavior() {
    context.map()
      .on('move.behaviorHash', _throttledUpdate);

    const q = utilStringQs(window.location.hash);

    if (q.map) {
      behavior.hadLocation = true;
    }
    else if (prefs('map-location')) {
      const mapArgs = prefs('map-location').split('/').map(Number);
      context.map().centerZoom([Math.min(_latitudeLimit, Math.max(-_latitudeLimit, mapArgs[1])), mapArgs[2]], mapArgs[0]);

      updateHashIfNeeded();

      behavior.hadLocation = true;
    }

    hashchange();
  }

  behavior.off = function() {
    _throttledUpdate.cancel();
    context.map()
      .on('move.behaviorHash', null);
    window.location.hash = '';
  };

  return behavior;
}