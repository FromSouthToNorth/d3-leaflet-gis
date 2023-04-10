import { select as d3_select } from 'd3-selection';

export function svgDefs(context) {

  let _defsSelection = d3_select(null);

  function drawDefs(selection) {
    _defsSelection = selection.append('defs');

    // add patterns
    var patterns = _defsSelection.selectAll('pattern')
      .data([
        // pattern name, pattern image name
        ['beach', 'dots'],
        ['construction', 'construction'],
        ['cemetery', 'cemetery'],
        ['cemetery_christian', 'cemetery_christian'],
        ['cemetery_buddhist', 'cemetery_buddhist'],
        ['cemetery_muslim', 'cemetery_muslim'],
        ['cemetery_jewish', 'cemetery_jewish'],
        ['farmland', 'farmland'],
        ['farmyard', 'farmyard'],
        ['forest', 'forest'],
        ['forest_broadleaved', 'forest_broadleaved'],
        ['forest_needleleaved', 'forest_needleleaved'],
        ['forest_leafless', 'forest_leafless'],
        ['golf_green', 'grass'],
        ['grass', 'grass'],
        ['landfill', 'landfill'],
        ['meadow', 'grass'],
        ['orchard', 'orchard'],
        ['pond', 'pond'],
        ['quarry', 'quarry'],
        ['scrub', 'bushes'],
        ['vineyard', 'vineyard'],
        ['water_standing', 'lines'],
        ['waves', 'waves'],
        ['wetland', 'wetland'],
        ['wetland_marsh', 'wetland_marsh'],
        ['wetland_swamp', 'wetland_swamp'],
        ['wetland_bog', 'wetland_bog'],
        ['wetland_reedbed', 'wetland_reedbed'],
      ])
      .enter()
      .append('pattern')
      .attr('id', function(d) {
        return 'ideditor-pattern-' + d[0];
      })
      .attr('width', 32)
      .attr('height', 32)
      .attr('patternUnits', 'userSpaceOnUse');

    patterns
      .append('rect')
      .attr('x', 0)
      .attr('y', 0)
      .attr('width', 32)
      .attr('height', 32)
      .attr('class', function(d) {
        return 'pattern-color-' + d[0];
      });

    patterns
      .append('image')
      .attr('x', 0)
      .attr('y', 0)
      .attr('width', 32)
      .attr('height', 32)
      .attr('xlink:href', function(d) {
        return context.imagePath('pattern/' + d[1] + '.png');
      });
  }

  return drawDefs;

}