import { select as d3_select } from 'd3-selection';
import {svg as d3_svg} from 'd3-fetch';

import { utiArrayUniq } from '../util/index.js';

export function svgDefs(context) {

  let _defsSelection = d3_select(null);

  let _spritesheetIds = [
    'iD-sprite', 'maki-sprite', 'temaki-sprite', 'fa-sprite', 'roentgen-sprite', 'community-sprite',
  ];

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
        return 'hy-pattern-' + d[0];
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

    addSprites(_spritesheetIds, true);
  }

  function addSprites(ids, overrideColors) {
    _spritesheetIds = utiArrayUniq(_spritesheetIds.concat(ids));

    const spritesheets = _defsSelection
      .selectAll('.spritesheet')
      .data(_spritesheetIds);

    spritesheets
      .enter()
      .append('g')
      .attr('class', function(d) {
        return 'spritesheet spritesheet-' + d;
      })
      .each(function(d) {
        var url = context.imagePath(d + '.svg');
        var node = d3_select(this)
          .node();
        d3_svg(url)
          .then(function(svg) {
            node.appendChild(
              d3_select(svg.documentElement)
                .attr('id', 'hy-' + d)
                .node(),
            );
            if (overrideColors && d !== 'iD-sprite') {   // allow icon colors to be overridden..
              d3_select(node)
                .selectAll('path')
                .attr('fill', 'currentColor');
            }
          })
          .catch(function() {
            /* ignore */
          });
      });

    spritesheets
      .exit()
      .remove();
  }

  drawDefs.addSprites = addSprites;

  return drawDefs;

}