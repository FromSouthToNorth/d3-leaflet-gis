import { svgTagClasses } from './tag_classes.js';

export function svgPoints(projection, context) {

  const map = context.map()
    .getMap();

  function markerPath(selection, klass) {
    selection.attr('class', klass)
      .attr('transform', 'translate(-8, -23)')
      .attr('d', 'M 17,8 C 17,13 11,21 8.5,23.5 C 6,21 0,13 0,8 C 0,4 4,-0.5 8.5,-0.5 C 13,-0.5 17,4 17,8 z');
  }

  function sortY(a, b) {
    return b.loc[1] - a.lat[1];
  }

  function drawPoints(selection, data) {

    selection.append('g')
      .attr('class', 'points');

    const drawLayer = selection.selectAll('.points');
    let groups = drawLayer.selectAll('g.point')
      .data(data);

    groups.exit()
      .remove();

    const enter = groups.enter()
      .append('g')
      .attr('class', function(d) {
        return 'node point ' + d.wid;
      });
    enter.append('path')
      .call(markerPath, 'shadow');

    enter.append('ellipse')
      .attr('cx', 0.5)
      .attr('cy', 1)
      .attr('rx', 6.5)
      .attr('ry', 3)
      .attr('class', 'stroke');

    enter.append('path')
      .call(markerPath, 'stroke');

    enter.append('use')
      .attr('transform', 'translate(-5.5, -20)')
      .attr('class', 'icon')
      .attr('width', '12px')
      .attr('height', '12px');

    const onZoom = () => {
      groups =
        groups.merge(enter)
          .attr('transform', function({ geometry }) {
            const latLng = L.latLng(geometry.coordinates[1], geometry.coordinates[0]);
            const { x, y } = map.latLngToLayerPoint(latLng);
            return `translate(${x}, ${y})`;
          }).call(svgTagClasses());

      groups.select('.shadow');
      groups.select('.stroke');
    };

    onZoom();
    context.map()
      .on('zoom.points', onZoom);
  }

  return drawPoints;

}
