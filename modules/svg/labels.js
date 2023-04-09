import { path as d3_path } from 'd3-path';
import RBush from 'rbush';
import Wcities from '../../data/Wcities.json';

export function svgLabels(projection, context) {
  const map = context.map()
    .getMap();

  function drawPointLabels(selection, entities, classes) {
    const texts = selection.selectAll('text.' + classes)
      .data(entities);

    texts.exit()
      .remove();

    texts.enter()
      .append('text')
      .attr('class', function(d) {
        return classes + ' ' + 'point'  + ' ' + d.properties.Name;
      })
      .merge(texts)
      .style('text-anchor', 'start')
      .attr('x', function(d) {
        return get(d.geometry.coordinates, 'x') + 15;
      })
      .attr('y', function(d) {
        return get(d.geometry.coordinates, 'y') - 12;
      })
      .text(function(d) {
        return d.properties.Name;
      });
  }

  function get(latLng, prop) {
    const _latLng = L.latLng(latLng[1], latLng[0]);
    return map.latLngToLayerPoint(_latLng)[prop];
  }

  function drawLabels(selection) {
    const layer = selection.append('g')
      .attr('class', 'labels');

    layer.selectAll('.labels-group')
      .data(['halo', 'label'])
      .enter()
      .append('g')
      .attr('class', function(d) {
        return 'labels-group ' + d;
      });

    const halo = layer.selectAll('.labels-group.halo');
    const label = layer.selectAll('.labels-group.label');

    const onZoom = () => {
      // points
      drawPointLabels(label, Wcities.features, 'pointlabel');
      drawPointLabels(halo, Wcities.features, 'pointlabel-halo');
    };
    onZoom();
    context.map()
      .on('zoom.labels', onZoom);
  }

  return drawLabels;
}