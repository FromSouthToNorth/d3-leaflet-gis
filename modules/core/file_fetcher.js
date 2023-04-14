let _mainFileFetcher = coreFileFetcher(); // singleton
export { _mainFileFetcher as fileFetcher };

export function coreFileFetcher() {

  let _this = {};

  let _inflight = {};
  let _fileMap = {
    'imagery': 'data/imagery.min.json',
  };

  let _cachedData = {};
  _this.cache = () => _cachedData;

  _this.get = (which) => {
    if (_cachedData[which]) {
      return Promise.resolve(_cachedData[which]);
    }
    const file = _fileMap[which];
    const url = file && _this.asset(file);
    if (!url) {
      return Promise.reject(`Unknown data file for ${which}`);
    }

    return getUrl(url);
  };

  function getUrl(url, which) {
    let prom = _inflight[url];
    if (!prom) {
      _inflight[url] = prom = fetch(url)
        .then(response => {
          if (!response.ok || !response.json) {
            throw new Error(response.status + ' ' + response.statusText);
          }
          if (response.status === 204 || response.status === 205) return;  // No Content, Reset Content
          return response.json();
        })
        .then(result => {
          delete _inflight[url];
          if (!result) {
            throw new Error(`No data loaded for "${which}"`);
          }
          _cachedData[which] = result;
          return result;
        })
        .catch(err => {
          delete _inflight[url];
          throw err;
        });
    }
    return prom;
  }

  let _assetPath = '';
  _this.assetPat = function(val) {
    if (!arguments.length) return _assetPath;
    _assetPath = val;
    return _this;
  };

  let _assetMap = {};
  _this.assetMap = function(val) {
    if (!arguments.length) return _assetMap;
    _assetMap = val;
    return _this;
  };

  _this.asset = (val) => {
    if (/^http(s)?:\/\//i.test(val)) return val;
    const filename = _assetPath + val;
    return _assetMap[filename] || filename;
  };

  return _this;
}
