import { geoPath as d3_geoPath } from 'd3-geo';

import vanAreas from '../../data/VanAreas.json';

export function svgAreas(projection, context) {
  const layers = { fill: {}, shadow: {}, stroke: {} };
  let clipPaths, clipPathsEnter, path;

  function drawAreas(selection) {
    path = d3_geoPath()
      .projection(projection);

    const gs = [
      'fill', 'shadow', 'stroke',
    ];

    const defs = selection
      .append('defs')
      .attr('class', 'surface-defs');
    clipPaths = defs.selectAll('.cliPath-osm')
      .data(vanAreas.features);
    clipPaths.exit()
      .remove();
    clipPathsEnter = clipPaths.enter()
      .append('clipPath')
      .attr('class', 'clipPath-osm')
      .attr('id', function(entity) {
        return 'ideditor-' + entity.properties.MAPID + '-clippath';
      });
    clipPathsEnter.append('path');

    const area = selection.append('g')
      .attr('class', 'areas');

    gs.forEach(function(layer) {
      layers[layer].g =
        area.append('g')
          .attr('class', 'area-' + layer);
      layers[layer].paths =
        layers[layer].g.selectAll('path')
          .data(vanAreas.features)
          .join('path')
          .attr('class', function(entity) {
            return 'area ' + layer + ' ' + entity.properties.MAPID;
          })
          .attr('clip-path', function(entity) {
            return layer === 'fill' ? 'url(#ideditor-' + entity.properties.MAPID + '-clippath)' : null;
          });
    });

    const onZoom = () => {
      clipPaths.merge(clipPathsEnter)
        .selectAll('path')
        .attr('d', path);
      Object.keys(layers)
        .forEach(function(key) {
          layers[key].paths.attr('d', path);
        });
    };

    onZoom();
    context.map()
      .on('zoom.areas', onZoom);
  }

  return drawAreas;

}