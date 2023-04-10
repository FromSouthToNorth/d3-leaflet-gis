import { geoPath as d3_geoPath } from 'd3-geo';
import { select as d3_select } from 'd3-selection';

import vanAreas from '../../data/VanAreas.json';

export function svgAreas(projection, context) {

  function drawAreas(selection, data) {
    // const layers = { fill: {}, shadow: {}, stroke: {} };
    let clipPaths, clipPathsEnter, path;

    const layers = {
      clip: data, shadow: data, stroke: data, fill: data,
    };

    path = d3_geoPath()
      .projection(projection);

    const defs = selection
      .append('defs')
      .attr('class', 'surface-defs');
    clipPaths = defs.selectAll('.cliPath-osm')
      .data(layers.clip);
    clipPaths.exit()
      .remove();
    clipPathsEnter = clipPaths.enter()
      .append('clipPath')
      .attr('class', 'clipPath-osm')
      .attr('id', function(entity) {
        return 'ideditor-' + entity.wid + '-clippath';
      });
    clipPathsEnter.append('path');

    const drawLayer = selection.append('g')
      .attr('class', 'areas');

    let group = drawLayer
      .selectAll('g.areagroup')
      .data(['fill', 'shadow', 'stroke']);

    group = group.enter()
      .append('g')
      .attr('class', function(d) {
        return 'areagroup area-' + d;
      }).merge(group);

    let paths = group
      .selectAll('path')
      .data(function(layer) {
        return layers[layer];
      });

    paths.exit().remove();


    const onZoom = () => {
      clipPaths.merge(clipPathsEnter)
        .selectAll('path')
        .attr('d', path);
      paths = paths.enter()
        .insert('path')
        .merge(paths)
        .each(function(entity) {
          const layer = this.parentNode.__data__;
          this.setAttribute('class', `area ${layer} ${entity.wid}`);
          if (layer === 'fill') {
            this.setAttribute('clip-path', `url(#ideditor-${entity.wid}-clippath)`);
          }
        })
        .attr('class', function(d) {
          const { properties } = d;
          console.log(properties.landuse);
          let clazz = this.getAttribute('class');
          clazz += properties.building === 'yes' ? ' building' : ''
          clazz += properties.landuse ? ' ' + properties.landuse : '';
          clazz += properties.leisure ? ' ' + properties.leisure : '';
          clazz += properties.natural ? ' ' + properties.natural : '';
          return clazz;
        })
        .attr('d', path);
    };

    onZoom();
    context.map()
      .on('zoom.areas', onZoom);
  }

  return drawAreas;

}
