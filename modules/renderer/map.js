import 'leaflet';

import { select as d3_select } from 'd3-selection';
import { dispatch as d3_dispatch } from 'd3-dispatch';
import { geoTransform as d3_geoTransform } from 'd3-geo';

import { utilRebind } from '../util/index.js';
import { svgAreas, svgLabels, svgPoints } from '../svg/index.js';

const zoom = 2;
const minZoom = 2;
const maxZoom = 24;
const center = [0, 0];
const tileLayers = [
  {
    url: 'https://services.digitalglobe.com/earthservice/tmsaccess/tms/1.0.0/DigitalGlobe:ImageryTileService@EPSG:3857@jpg/{z}/{x}/{y}.jpg?connectId={connectId}',
    options: {
      connectId: '4b89311e-b430-46dd-9060-98e6473d846e',
      tms: true,
      key: 'Maxar Premium Imagery',
    },
  },
  {
    url: 'https://api.mapbox.com/styles/v1/openstreetmap/ckasmteyi1tda1ipfis6wqhuq/tiles/256/{z}/{x}/{y}@2x?access_token={access_token}',
    options: {
      access_token: 'pk.eyJ1Ijoib3BlbnN0cmVldG1hcCIsImEiOiJjbGRlaXd3cHUwYXN3M29waWp0bGNnYWdyIn0.RRlhUnKlUFNhKsKjhaZ2zA',
      key: 'Position Assist Overlay',
    },
  },
];

export function rendererMap(context) {

  const dispatch = d3_dispatch('move', 'drawn', 'zoom');
  let _selection = d3_select(null);
  let _map;

  function map(selection) {
    _selection = selection;
    _map = L.map(_selection.node(), {
      center,
      zoom,
      minZoom,
      maxZoom,
    });

    tileLayers.forEach((layer) => {
      L.tileLayer(layer.url, layer.options)
        .addTo(_map);
    });

    L.svg({ clickable: true })
      .addTo(_map);

    _map.on('move', function() {
      dispatch.call('move', this, map);
    });

    _map.on('zoom', function() {
      dispatch.call('zoom', this, map);
    });
  }

  map.mainMap = function() {
    return d3_select('.main-map');
  };

  map.overlayPane = function() {
    return d3_select(_map.getPanes()['overlayPane'])
      .select('svg')
      .attr('pointer-events', 'auto');
  };

  const projectPoint = function(x, y) {
    const point = _map.latLngToLayerPoint(new L.LatLng(y, x));
    this.stream.point(point.x, point.y);
  };

  map.projection = () => d3_geoTransform({ point: projectPoint });

  map.point = (point) => {
    const latLng = L.latLng(point[1], point[0]), { x, y } = map.getMap()
      .latLngToLayerPoint(latLng);
    return [x, y];
  };

  map.invert = (point) => {
    const { lat, lng } = map.getMap()
      .layerPointToLatLng(L.point(point[1], point[0]));
    return [lng, lat];
  };

  map.getMap = function() {
    return _map;
  };
  map.center = function() {
    const { lat, lng } = _map.getCenter();
    return [lng, lat];
  };
  map.zoom = function() {
    return _map.getZoom();
  };

  function setCenterZoom(center, zoom) {
    _map.setView(center, zoom);
  }

  function zoomIn(delta) {
    setCenterZoom(map.center(), ~~map.zoom() + delta);
  }

  function zoomOut(delta) {
    setCenterZoom(map.center(), ~~map.zoom() - delta);
  }

  map.centerZoom = function(loc2, z2) {
    setCenterZoom(loc2, z2);
    dispatch.call('move', this, map);
    return map;
  };

  map.init = function() {
    console.log('map_init');
  };

  return utilRebind(map, dispatch, 'on');
}
